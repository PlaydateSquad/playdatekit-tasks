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
    constructor() {
        
    }
    
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

        return new TaskProcessAction("/usr/bin/open", {
            args: ["-a", `${sdkPath}/bin/Playdate Simulator.app`, pluginOutPath],
        });
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
