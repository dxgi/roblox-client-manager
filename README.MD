# Roblox Client Manager

The "roblox-client-manager" is a tool designed to seamlessly coordinate all active Roblox clients, facilitating smooth code execution through Visual Studio Code integration.

### Added
- 🚀 Custom host and port settings to facilitate mobile and WiFi support.
- ✔️ Implemented an independent startup loader for automatic updates.
- ✔️ Introduced persistent WebSocket functionality: reconnects every 1 second if disconnected.
- ✔️ Added support for multi-instances, specifically for executors compatible with multi-instance functionality like Wave.
- ✔️ Implemented support for executing the code within the present TextEditor across all active instances.

### Fixes
- 🐛 Fixed client's resolver not automatically updating when a client disconnects.
- 🐛 It will now automatically reconnect every 1 second if failed to connect or lost connection
- 🐛 Addressed startup failures occurring under specific circumstances.
- 🐛 Addressed Player and Game resolvers.


### How to setup
```lua
-- 1. Install the Visual Studio Code extension from the Marketplace.

-- 2. Place the following script below to your executor's autoexec folder.

local host = 'ws://localhost:6969';

pcall(function()
    local func, err = loadstring(
		game:HttpGet(
    		'https://raw.githubusercontent.com/dxgi/roblox-client-manager/main/roblox-client-manager.luau'
      	)
    );
  
    if not func then
      	error(err)
    else
		func()(host);
    end
end)
```