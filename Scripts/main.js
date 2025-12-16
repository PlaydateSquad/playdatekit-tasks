const LLDB_PORT = 1847;

let taskProvider = null;
exports.activate = function() {
    taskProvider = new TaskProvider();
    nova.assistants.registerTaskAssistant(taskProvider, {
        identifier: "pdkr-tasks",
        name: "PlaydateKit Runner"
    });
}

exports.deactivate = function() {
    taskProvider = null;
}


class TaskProvider {
    constructor() {}
    
    resolveTaskAction(context) {
        let action = context.action;
        let config = context.config;

        if (action == Task.Build) {
            return this.resolvePackageTaskAction(config);
        } else if (action == Task.Run) {
            return this.resolveSimulatorTaskAction(config);
        } else if (action == Task.Clean) {
            return this.resolveCleanAction(config);
        }
        return null;
    }

    resolvePackageTaskAction(config) {
        const target = config.get("target", "string");
        const path = config.get("package-path", "string");
        let commandArguments = [];
        let pathArgs = [];

        if (path != "") {
            pathArgs = ["--package-path", path];
        }

        if (target == "device") {
            commandArguments.push("--device-only");
        } else if (target == "simulator") {
            commandArguments.push("--simulator-only");
        }

        const additionalDeviceOs = config.get("extraDeviceOs", "stringArray");
        if (additionalDeviceOs != undefined && additionalDeviceOs != null) {
            let deviceOsArgs = ["--extra-device-o-files-build-dirs", ...additionalDeviceOs];
            if (target == "device") {
                commandArguments = [...commandArguments, ...deviceOsArgs];
            }
        }
        
        return new TaskProcessAction("swift", {
            args: ["package", ...pathArgs, "pdc", "-v", ...commandArguments],
            shell: true
        });
    }

    resolveSimulatorTaskAction(config) {
        let productName = config.get("product-name", "string");
        if (productName == undefined || productName == null || productName == "") {
            productName = nova.workspace.configuration.get("workspace-name", "string");
        }

        let pluginOutPath = ".build/plugins/PDCPlugin/outputs/" + `${productName}.pdx`;
        let packagePath = config.get("package-path", "string");
        if (packagePath != undefined && packagePath != "") {
            pluginOutPath = packagePath + "/" + pluginOutPath;
        }

        const defaultSDKPath = "~/Developer/PlaydateSDK";
        let overridePath = config.get("sdk-path", "string");
        let chosenPath = defaultSDKPath;
        if (overridePath != undefined, overridePath != null, overridePath != "") {
            chosenPath = sdkPath
        }

        const sdkPath = nova.path.expanduser(chosenPath);

        let allowDebugging = config.get("allowDebug", "boolean");
        if (allowDebugging == undefined || allowDebugging == null) {
            allowDebugging = false;
        }

        if (typeof TaskDebugAdapterAction != 'undefined' && allowDebugging) {
            let action = new TaskDebugAdapterAction("lldb");

            const swiftlyToolchain = nova.path.expanduser("~/.swiftly")
            let toolchain = "";
            let toolchainType = config.get("toolchain", "string");
            if (toolchainType == undefined || toolchainType == null || toolchainType == "swiftly") {
                toolchain = swiftlyToolchain;
            } else {
                const customToolchain = config.get("toolchain.custom", "string");
                if (customToolchain == null || customToolchain == undefined) {
                    toolchain = swiftlyToolchain;
                } else {
                    toolchain = `${customToolchain}/usr`;
                }
            }

            action.command = `${toolchain}/bin/lldb-dap`;
            action.args = ["--port", LLDB_PORT.toString()];
            action.transport = "socket";
            action.socketPort = LLDB_PORT;

            let request = config.get("request", "string");
            if (request == undefined || request == null) {
                request = "launch";
            }

            action.debugRequest = request;
            action.debugArgs = {
                program: `${sdkPath}/bin/Playdate Simulator.app`,
                host: "localhost",
                port: LLDB_PORT,
                args: [pluginOutPath],
                cwd: nova.path.normalize(packagePath || nova.workspace.path)
            };
            return action;
        } else {
            return new TaskProcessAction("/usr/bin/open", {
                args: ["-a", `${sdkPath}/bin/Playdate Simulator.app`, pluginOutPath],
            });
        }
    }

    resolveCleanAction(config) {
        let defaultPath = ".build";
        let packagePath = config.get("package-path", "string");
        if (packagePath != undefined, packagePath != null, packagePath != "") {
            defaultPath = `${packagePath}/.build`
        }

        return new TaskProcessAction("/bin/rm", {
            args: ["-rf", defaultPath],
            shell: true 
        });
    }
}
