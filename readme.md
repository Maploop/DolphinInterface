# DolphinInterface
An Electron based app to interact with a locally hosted DOLPHIN LLM - I developped this application to more easily interact with Dolphin and have a way to save my chats; Here's how to use it:

This application also supports markdown in the chat interface for easier readability.


# Install Dolphin Locally
1. Follow [this guide](https://dev.to/shahdeep/how-to-run-dolphin-uncensored-ai-locally-a-step-by-step-guide-3o4l) to get a locally hosted Dolphin LLM
2. Make sure to run the test command `ollama run dolphin-llama3` in order to check if your Dolphin is working, then simply type `/bye` to exit the CLI and follow the rest of this guide.

# Compile & Run the app
### Make sure you have NodeJS installed!
Run the following command:
```shell
git clone https://github.com/Maploop/DolphinInterface.git && cd ./DolphinInterface && npm install && npx electron-forge import && npm run make && cd ./out/make/squirrel.windows/x64 && start "lh-dl3-1.0.0 Setup.exe"
```
This will automatically clone, compile and start the application.

