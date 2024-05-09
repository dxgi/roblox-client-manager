if not game:IsLoaded() then
    game.Loaded:Wait()
end

--#region Services

local HttpService = game:GetService('HttpService');

local MarketplaceService = game:GetService('MarketplaceService');

local Player = game:GetService('Players').LocalPlayer;

--#endregion

--#region Variables

local Name = Player.DisplayName or Player.Name or 'Unknown';

local Game = MarketplaceService:GetProductInfo(game.PlaceId).Name;

local _, Socket = false, nil;

local IsRunning = false;

--#endregion

--#region Functions

local function Activate(TryConnect)
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
                                    Socket:Send(
                                        HttpService:JSONEncode(
                                            {
                                                op = 'OP_ERROR',
                                                data = {
                                                    message = err
                                                }
                                            }
                                        )
                                    );
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

            IsRunning = false;
        end);
    else
        _, Socket = pcall(TryConnect);
    end
end

local function Heartbeat()
    Socket:Send(
        HttpService:JSONEncode(
            {
                op = 'OP_HEARTBEAT',
                data = {}
            }
        )
    );
end

--#endregion

return function(host: string)
    local TryConnect = function()
        return WebSocket.connect(host)
    end

    local Retries = 1;

    while true do
        wait(1);

        if not Socket or not pcall(Heartbeat) then
            // print('[roblox-client-manager] Attemping to reconnect... (' .. Retries .. 'x)');

            IsRunning = false;

            Retries += 1;

            _, Socket = pcall(TryConnect);
        elseif not IsRunning then
            IsRunning = true;

            pcall(Activate, TryConnect);
        end
    end
end
