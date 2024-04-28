local HttpService = game:GetService('HttpService');

local Player = game:GetService('Players').LocalPlayer;

local Name = Player.DisplayName;

local Game = game.Name;

if not Name then
    Name = Player.Name;
end

if not Game then
    Game = 'Unknown';
end

local Socket = WebSocket.connect('ws://localhost:6969');

if Socket then
    Socket:Send(
        HttpService:JSONEncode(
            {
                op = 'OP_IDENTIFY',
                data = {
                    player = {
                        name = Name
                    },
                    game = {
                        name = Game
                    }
                }
            }
        )
    );

    Socket.OnMessage:Connect(function(input: string)
        local message = HttpService:JSONDecode(input);

        if typeof(message) == 'table' then
            if typeof(message.op) ~= 'string' or typeof(message.data) ~= 'table' then
                error('Invalid Data');
            else
                local op = message.op;

                local data = message.data;

                if op == 'OP_EXECUTE' then
                    local source = data.source;

                    if source then
                        pcall(function()
                            local func, err = loadstring(source, 'roblox-client-manager');

                            if not func then
                                error(err);
                            else
                                func();
                            end
                        end)
                    end
                end
            end
        end
    end);

    Socket.OnClose:Connect(function()
        Socket = nil;

        warn('Connection Closed');
    end);
end