**PlaydateKit Tasks** provides Task integration with **PlaydateKit**, allowing you to quickly build and run apps and games for the Playdate console with PlaydateKit.

> **⚠️ Important**  
> This is not an official extension developed and/or endorsed by Panic; It is a community-developed project.

> **Note**  
> If you are looking for tools to assist with developing apps and games for the Playdate with either Lua or C, you'll want Panic's official extension instead, which you can find below.
>
> [Install Playdate extension &rsaquo;](nova://extension/?id=com.panic.Playdate&name=Playdate)

PlaydateKit Tasks provides tasks for:

- Building projects as a universal package (simulator + device), a simulator-only build, and/or a device-only build;
- Running projects through the Playdate Simulator
- Cleaning build folders

## Requirements

PlaydateKit Tasks requires some additional tools to be installed on your Mac:

- [Playdate SDK](https://play.date/dev)  
- Swift toolchain v6.2 or later (Swiftly is recommended)

You might also want to install these extensions, although they are not required for PlaydateKit Tasks to function:

- [Icarus](nova://extension/?id=panic.Icarus&name=Icarus)

## Usage

To run PlaydateKit Tasks's _Build_ action, add either **Build Playdate Package** or **Playdate Simulator (PlaydateKit)** to your tasks and then do any of the following:

- Click the **Build** 🔨 button in the project toolbar;
- Select the **Project → Build** menu item;
- Press **Command-B**; or
- Open the command palette and type `build`

### Debugging

The **Playdate Simulator (PlaydateKit)** task also supports debugging capabilities via LLDB and your toolchain's `lldb-dap` executable. Debugging is enabled by default and should trigger when you set a breakpoint. You can adjust the settings for debugging in your workspace's settings by opening the Task dropdown and selecting **Edit Task...**, then scrolling to the **Debugging** section of the task.

> **⚠️ Important**  
> Debugging support is currently experimental and may require changes to PlaydateKit and/or your project. Refer to [PlaydateKit#152](https://github.com/finnvoor/PlaydateKit/pull/152) for the patch details.

### Configuration

You can adjust the settings for these tasks in your workspace's settings by opening the Task dropdown and selecting **Edit Task...**.

### Contribute

**PlaydateKit Tasks** accepts pull request contributions from its GitHub repository mirror, which you can find at the link below. Please note that the source of truth is hosted on [SkyVault](https://source.marquiskurt.net/PDUniverse/pdkit-tasks).

[GitHub Repository &rsaquo;](https://github.com/PlaydateSquad/playdatekit-tasks)

If you'd like to report a bug or request a feature, you can do so on the extension's page on YouTrack:

[Send feedback on YouTrack &rsaquo;](https://youtrack.marquiskurt.net/youtrack/newIssue?project=PDKR&c=Stage+To+Do)

### License

**PlaydateKit Tasks** is free and open-source software licensed under the MIT License. For more information on your rights, refer to LICENSE.md.
