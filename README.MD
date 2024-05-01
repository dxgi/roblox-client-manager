# Roblox Client Manager

The "roblox-client-manager" is a tool designed to seamlessly coordinate all active Roblox clients, facilitating smooth code execution through Visual Studio Code integration.

## How to setup
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