# README

# Getting started

1. Open a Terminal (you can use the Spotligh Search to find it)
2. Go to directory where you want the plugin to be saved using the `cd` command. For example, if you want to save it in the Documents, you'd write `cd ~/Documents`
3. Paste the following commands into the terminal. They will download the plugin and start a development server. `git clone git@github.com:marianafcosta/yummy-figma-plugin.git; git -C yummy-figma-plugin pull --force; npm install --prefix yummy-figma-plugin/global-style-to-code && npm run start --prefix yummy-figma-plugin/global-style-to-code`
4. Leave the Terminal window open!
5. Open the Figma Desktop app
6. Open any design file
7. If you're opening the plugin for the first time, go to Plugins > Development > Import plugin from manifest
8. This will open a Finder window; go to the folder you downloaded a few steps ago and select the `manifest.json` file in the `yummy-figma-plugin/global-style-to-code` sub-directory
9. The plugin should now be running
10. Once imported, subsequent runs of the plugin can be started by going to Plugins > Development > global-style-to-code
11. When you're finished testing, go to the Terminal window and press `^C`
12. You can close the Terminal window

