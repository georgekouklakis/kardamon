//OnlineTichu JavaScript Library
(function () {
    var OnlineTichu = {

        //jQuery Selectors.
        $userID: $('#UserID'),
 $sessionID: $('#SessionID'),
 $Username: $('#Username'),
 $UserFriends: $('#UserFriends'),
 $RoleID: $('#RoleID'),
 $Image: $('#Image'),
 $ColorHex: $('#ColorHex'),
 $IsCheater: $('#IsCheater'),
 $table: $('#table'),
 $tables: $('#tables'),
 $bodypage: $('#bodypage'),
 $gameField: $('#gameField'),
 $sortables: $('#southPlayerPass, #southPlayer'),
 $passCards: function () { return $('.chosenCard') },
 $exchangeCards: $('#exchangeCards'),
 $exchangedCards: $('#exchangedCards'),
 $bombs: $('#bombs'),
 $chatMessage: $('#chatMessage'),
 $onlineUsers: $('#onlineUsers'),
 $scores: $('#scores'),
 $scoreDetails: $('#scoreDetails'),
 $spectators: $('#spectators'),
 $spectatorsDetails: $('#spectatorsDetails'),
 $numUsers: $('#numUsers'),
 $chatbox: $('#chatbox'),
 $startTable: $('#startTable'),
 $nextCards: $('#nextCards'),
 $playTurn: $('#playTurn'),
 $playBomb: $('#playBomb'),
 $fold: $('#fold'),
 $callGrandTichu: $('#callGrandTichu'),
 $callTichu: $('#callTichu'),
 $northPlayer: $('#northPlayer'),
 $westPlayer: $('#westPlayer'),
 $eastPlayer: $('#eastPlayer'),
 $northPlayerName: $('#northPlayerName'),
 $northPlayerImage: $('#northPlayerImage'),
 $northPlayerText: $('#northPlayerText'),
 $northPlayerTichu: $('#northPlayerTichu'),
 $northPlayerGoldTourns: $('#northPlayerGoldTourns'),
 $northPlayerLevel: $('#northPlayerLevel'),
 $westPlayerName: $('#westPlayerName'),
 $westPlayerImage: $('#westPlayerImage'),
 $westPlayerText: $('#westPlayerText'),
 $westPlayerTichu: $('#westPlayerTichu'),
 $westPlayerGoldTourns: $('#westPlayerGoldTourns'),
 $westPlayerLevel: $('#westPlayerLevel'),
 $eastPlayerName: $('#eastPlayerName'),
 $eastPlayerImage: $('#eastPlayerImage'),
 $eastPlayerText: $('#eastPlayerText'),
 $eastPlayerTichu: $('#eastPlayerTichu'),
 $eastPlayerGoldTourns: $('#eastPlayerGoldTourns'),
 $eastPlayerLevel: $('#eastPlayerLevel'),
 $southPlayerName: $('#southPlayerName'),
 $southPlayerImage: $('#southPlayerImage'),
 $southPlayerText: $('#southPlayerText'),
 $southPlayerTichu: $('#southPlayerTichu'),
 $southPlayerGoldTourns: $('#southPlayerGoldTourns'),
 $southPlayerLevel: $('#southPlayerLevel'),
 $southPlayer: $('#southPlayer'),
 $tableCards: $('#tableCards'),
 $brand: $('#brand'),
 $usernameLink: $('#usernameLink'),
 $users: $('#users'),
 $tempData: $('#tempData'),
 $darkColorData: $('#darkColorData'),
 $darkColorDataMessage: $('#darkColorDataMessage'),
 $exchangeId: $('#exchangeId'),
 $reviewMessage: $('#reviewMessage'),
 $reviewDone: $('#reviewDone'),
 $reviewContainer: $('#reviewContainer'),
 $startReview: $('#startReview'),
 $nextExchange: $('#nextExchange'),
 $voteFair: $('#voteFair'),
 $voteCheat: $('#voteCheat'),
 $reviewUser1: $('#reviewUser1'),
 $reviewUser2: $('#reviewUser2'),
 $reviewInfo1: $('#reviewInfo1'),
 $reviewInfo2: $('#reviewInfo2'),
 $exchangeCard1: $('#exchangeCard1'),
 $exchangeCard2: $('#exchangeCard2'),
 $sentPoints: $('#sentPoints'),
 $op1Points: $('#op1Points'),
 $op2Points: $('#op1Points'),
 $pointsToWin: $('#pointsToWin'),
 $pointsToLoose: $('#pointsToLoose'),
 $gameMessage: $('#gameMessage'),
 $gameLog: $('#gameLog'),
 $askCards: $('#askCards'),
 $phoenixCards: $('#phoenixCards'),
 $northExchange: $('#northExchange'),
 $westExchange: $('#westExchange'),
 $eastExchange: $('#eastExchange'),
 $loading: $('#loading'),
 $loadingMessage: $('#loadingMessage'),
 $ingamePassword: $('#ingamePassword'),
 $dog: $('#dog'),
 $dogPlayer: $('#dogPlayer'),
 $muteSound: $('#muteSound'),
 $voteRestart: $('#voteRestart'),
 $autoFold: $('#autoFold'),
 $autoFoldValue: $('#autoFoldValue'),
 //$coinsLabel: $('#coinsLabel'),
 //$coinsLabelInner: $('#coinsLabelInner'),
 //$pointsLabel: $('#pointsLabel'),
 //$pointsLabelInner: $('#pointsLabelInner'),
 $globalChatMessage: $('#globalChatMessage'),
 $globalChatBox: $('#globalChatBox'),
 $globalChatMore: $('#globalChatMore'),
 $globalChatEmoticons: $('#globalChatEmoticons'),
 $globalOnlineUsersContainer: $('#globalOnlineUsersContainer'),
 $globalOnlineUsersMe: $('#globalOnlineUsersMe'),
 $globalOnlineUsersFriends: $('#globalOnlineUsersFriends'),
 $globalOnlineUsersMods: $('#globalOnlineUsersMods'),
 $globalOnlineUsersOthers: $('#globalOnlineUsersOthers'),
 $onlineUsersCount: $('#onlineUsersCount'),
 $clearChat: $('#clearChat'),
 $globalClearChat: $('#globalClearChat'),
 _exchangeCard: $('.exchangeCard'),
 _askCards: $('.askCards'),
 _phoenixCards: $('.phoenixCards'),
 _southPlayerCards: function () { return $('#southPlayer .card') },

 //Actions.
 //User triggered actions.
 action: {

     //GetGlobalChat.
     //Sends user's SessionID.
     GetOnlineUsers: function () {
         var socketMessage = {
             Description: 'GetGlobalChat',
             User: {
                 SessionID: ot.$sessionID.val()
             }
         };

         if (socketMessage.User.SessionID != null) {
             ot.SendWorldHubMessage(socketMessage);
         }
     },

     //GlobalChat.
     GlobalChat: function () {
         var socketMessage = {
             Description: 'GlobalChat',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Text: ot.$globalChatMessage.val()
         };

         if (socketMessage.Text.length == 0) {
             return false;
         }

         if (ot.spamCount > 4) {
             ot.$globalChatBox.append(ot.$globalChatBox.data('dontspam') + '<br>').scrollTop(ot.$globalChatBox[0].scrollHeight);
             ot.$globalChatMessage.val('');
             return false;
         }

         if (ot.spamTrigger == false) {
             ot.spamTrigger == true;
             setTimeout(function () {
                 ot.spamCount = 0;
                 ot.spamTrigger = false;
             }, 5000);
         }

         ot.SendWorldHubMessage(socketMessage);
         ot.$globalChatMessage.val('');
         ot.spamCount++;
     },

     //StartReview
     StartReview: function () {
         var socketMessage = {
             Description: 'StartReview',
             User: {
                 SessionID: ot.$sessionID.val()
             }
         };

         ot.SendWorldHubMessage(socketMessage);
     },

     //VoteFair
     VoteFair: function () {
         var socketMessage = {
             Description: 'VoteExchangeFair',
             Exchange: {
                 Id: ot.$exchangeId.val()
             },
             User: {
                 SessionID: ot.$sessionID.val()
             }
         };

         ot.SendWorldHubMessage(socketMessage);
     },

     //VoteCheat
     VoteCheat: function () {
         var socketMessage = {
             Description: 'VoteExchangeCheat',
             Exchange: {
                 Id: ot.$exchangeId.val()
             },
             User: {
                 SessionID: ot.$sessionID.val()
             }
         };

         ot.SendWorldHubMessage(socketMessage);
     },

     //EnterTable.
     EnterTable: function () {
         var socketMessageEnter = {
             Description: 'EnterTable',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid'),
 Password: ot.$table.data('tablepassword'),
             }
         };

         setTimeout(function () {
             ot.SendTableHubMessage(socketMessageEnter);
         }, 3000);
     },

     //ChangePosition.
     ChangePosition: function (position, toPosition) {

         switch (toPosition) {
             case "West":
                 position -= 1;
                 if (position == 0) {
                     position = 4
                 }
                 break;
             case "North":
                 position += 2;
                 if (position == 6) {
                     position = 2;
                 }
                 if (position == 5) {
                     position = 3;
                 }
                 break;
             case "East":
                 position += 1;
                 if (position == 5) {
                     position = 1
                 }
                 break;
         }

         var socketMessage = {
             Description: 'ChangePositionTo' + position,
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             }
         };

         ot.SendTableHubMessage(socketMessage);
     },

     //KickPlayer.
     KickPlayer: function (position) {
         ot.SendTableHubMessage({
             Description: 'KickPlayer' + position,
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             }
         });
     },

     //SystemKickPlayer.
     SystemKickPlayer: function (position) {
         ot.SendTableHubMessage({
             Description: 'SystemKickPlayer' + position,
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             }
         });
     },

     //StartTable.
     StartTable: function () {
         var socketMessage = {
             Description: 'StartTable',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             }
         };

         ot.SendTableHubMessage(socketMessage);
     },

     //AdminDeleteTable.
     AdminDeleteTable: function () {
         var socketMessage = {
             Description: 'AdminDeleteTable',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             }
         };

         ot.SendTableHubMessage(socketMessage);
     },

     //NextCards.
     NextCards: function () {
         var socketMessage = {
             Description: 'NextCards',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             }
         };

         ot.SendTableHubMessage(socketMessage);
     },

     //CallGrandTichu.
     CallGrandTichu: function () {
         var socketMessage = {
             Description: 'CallGrandTichu',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             }
         };

         ot.SendTableHubMessage(socketMessage);
     },

     //ExchangeCards.
     ExchangeCards: function () {
         var socketMessage = {
             Description: 'ExchangeCards',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             },
             Cards: [{ Shape: ot.$westExchange.children('li:nth-child(1)').data('shape'), Value: ot.$westExchange.children('li:nth-child(1)').data('value') }, { Shape: ot.$northExchange.children('li:nth-child(1)').data('shape'), Value: ot.$northExchange.children('li:nth-child(1)').data('value') }, { Shape: ot.$eastExchange.children('li:nth-child(1)').data('shape'), Value: ot.$eastExchange.children('li:nth-child(1)').data('value') }]
         };

         ot.SendTableHubMessage(socketMessage);
         ot.$exchangeCards.hide();
         ot._exchangeCard.hide();
         ot.$northExchange.children('li:nth-child(1)').remove();
         ot.$eastExchange.children('li:nth-child(1)').remove();
         ot.$westExchange.children('li:nth-child(1)').remove();
     },

     //PlayTurn.
     PlayTurn: function (phoenixCard) {
         var

         phoenixPlayed = false,
         cardArray = function (p) {
             var

             phoenixCard = p,
             passCards = ot.$passCards(),
 cardArray = [];
 cardArray.push({ Shape: '4', Value: 0 });

 for (var i = passCards.length - 1; i >= 0; i--) {
     if (passCards[i].getAttribute('data-shape') == 7) {
         phoenixPlayed = true;
     }

     if (passCards[i].getAttribute('data-shape') == 4) {
         cardArray[0].Value = function () {
             var askedCard;
             ot._askCards.each(function () {
                 if ($(this).hasClass('active')) {
                     askedCard = $(this).attr('id').split('_')[1];
                     $(this).removeClass('active');
                     $('#askCard_0').addClass('active');
                 }
             })
             return askedCard;
         }();
     }

     var card = {
         Shape: passCards[i].getAttribute('data-shape'),
 Value: passCards[i].getAttribute('data-value')
     }

     cardArray.push(card);
 }

 return cardArray;
         }(phoenixCard),

 socketMessage = {
     Description: 'PlayTurn',
     User: {
         SessionID: ot.$sessionID.val()
     },
     Table: {
         TableID: ot.$table.data('tableid')
     },
     Cards: cardArray
 };

 if (socketMessage.Cards.length == 1) {
     return false;
 }

 if (phoenixPlayed == true) {
     if (socketMessage.Cards.length == 2) {
         ot.SendTableHubMessage(socketMessage);
         ot.$phoenixCards.hide();
     } else {
         if (phoenixCard) {
             $(socketMessage.Cards).each(function () {
                 if (this.Shape == 7) {
                     this.Value = phoenixCard;
                 }
             });
             ot.SendTableHubMessage(socketMessage);
             ot.$phoenixCards.hide();
         } else {
             ot.$phoenixCards.show();
         }
     }
 } else {
     ot.SendTableHubMessage(socketMessage);
 }
     },

     //PlayBomb.
     PlayBomb: function (bombid) {
         //console.log(3);
         var cardArray = [];

         cardArray.push({ Shape: '4', Value: 0 });

         socketMessage = {
             Description: 'TryBomb',
             BombID: bombid,
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             },
             Cards: cardArray
         };
         //alert("2");
         //alert("card array length: " + cardArray.length);
         ot.SendTableHubMessage(socketMessage);
         //alert("4");

     },

     //MuteSpectator.
     MuteSpectator: function (username) {
         //console.log(3);
         var socketMessage = {
             Description: 'MuteSpectator',
             Text: username,
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             }
         };
         //alert("2");
         //alert("card array length: " + cardArray.length);
         ot.SendTableHubMessage(socketMessage);
         //alert("4");

     },

     VoteRestart: function () {
         var socketMessage = {
             Description: 'VoteRestart',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             }
         };

         ot.SendTableHubMessage(socketMessage);
     },

     //Fold.
     Fold: function () {
         var cardArray = [];
         cardArray.push({ Shape: '4', Value: 0 });

         var socketMessage = {
             Description: 'PlayTurn',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             },
             Cards: cardArray
         };

         ot.SendTableHubMessage(socketMessage);
     },

     //CallTichu.
     CallTichu: function () {
         var socketMessage = {
             Description: 'CallTichu',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             }
         };

         ot.SendTableHubMessage(socketMessage);
     },

     //GiveDragon.
     GiveDragon: function (position) {
         var socketMessage = {
             Description: 'GiveDragon',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             },
             GiveDragonPosition: position,
         };

         ot.SendTableHubMessage(socketMessage);
     },

     //Chat.
     Chat: function () {
         var socketMessage = {
             Description: 'Chat',
             User: {
                 SessionID: ot.$sessionID.val()
             },
             Table: {
                 TableID: ot.$table.data('tableid')
             },
             Text: ot.$chatMessage.val()
         };

         ot.SendTableHubMessage(socketMessage);
         ot.$chatMessage.val('');
     },
 },

 //Reactions.
 //Automatically invoked methods through socket message descriptions, as reflections.
 reaction: {

     //CalculatePoints
     CalculatePoints: function (message) {
         //alert("answer");
         ot.$pointsToWin.text(message.Points[0].toString());
         ot.$pointsToLoose.text(message.Points[1].toString());

     },

     //RemoveUser.
     //Removes an offline player from the online players list.
     RemoveUser: function (message) {
         //                var

         //                removeUser = message.User;

         //                $('#User_' + removeUser.Username).remove();
         //                ot.$numUsers.text(parseInt(ot.$numUsers.text(), 10) - 1);

         ot.$numUsers.text(message.Users);
     },

     //TableCreated.
     //Reaction to ot.action.CreateTable(socket).
     //Redirects the user to his new created table.
     TableCreated: function (message) {
         //console.log(message.Table.ServerUrl);
         window.location = ot.$bodypage.data('table') + '/' + message.Table.ServerName + '/' + message.Table.TableID + (((message.Table.Password == null) ? "" : '/' + message.Table.Password));
     },

     //ReviewExchange
     ReviewExchange: function (message) {
         if (message.Exchange) {
             ot.$reviewDone.hide();
             ot.$reviewContainer.show();
             ot.$reviewMessage.hide();
             var

             exchangeId = message.Exchange.Id,
             exchangeData = JSON.parse(message.Exchange.Data),
 cards1 = exchangeData.Cards1,
 cards2 = exchangeData.Cards2,
 exchange1 = exchangeData.Exchange1,
 exchange2 = exchangeData.Exchange2,
 onTichu1 = exchangeData.OnTichu1,
 onTichu2 = exchangeData.OnTichu2,
 onGrandTichu1 = exchangeData.OnGrandTichu1,
 onGrandTichu2 = exchangeData.OnGrandTichu2;

 ot.$exchangeId.val(exchangeId);

 //Render user1's cards.
 var displayCardsHtmlString1 = "";
 $(cards1).each(function () {
     displayCardsHtmlString1 += '<li id="c' + this.Shape + '-' + this.Value + '" class="card c' + this.Shape + '-' + this.Value + '" data-shape="' + this.Shape + '" data-value="' + this.Value + '"></li>';
 });

 ot.$reviewUser1.html(displayCardsHtmlString1);

 //Render user2's cards.
 var displayCardsHtmlString2 = "";
 $(cards2).each(function () {
     displayCardsHtmlString2 += '<li id="c' + this.Shape + '-' + this.Value + '" class="card c' + this.Shape + '-' + this.Value + '" data-shape="' + this.Shape + '" data-value="' + this.Value + '"></li>';
 });

 ot.$reviewUser2.html(displayCardsHtmlString2);
 ot.$reviewInfo1.hide();
 ot.$reviewInfo2.hide();

 if (onTichu1) {
     ot.$reviewInfo1.text('Tichu');
     ot.$reviewInfo1.show();
 }

 if (onTichu2) {
     ot.$reviewInfo2.text('Tichu');
     ot.$reviewInfo2.show();
 }

 if (onGrandTichu1) {
     ot.$reviewInfo1.text('Grand');
     ot.$reviewInfo1.show();
 }

 if (onGrandTichu2) {
     ot.$reviewInfo2.text('Grand');
     ot.$reviewInfo2.show();
 }


 ot.$exchangeCard1.html('<li id="c' + exchange1.Shape + '-' + exchange1.Value + '" class="card c' + exchange1.Shape + '-' + exchange1.Value + '" data-shape="' + exchange1.Shape + '" data-value="' + exchange1.Value + '"></li>');
 ot.$exchangeCard2.html('<li id="c' + exchange2.Shape + '-' + exchange2.Value + '" class="card c' + exchange2.Shape + '-' + exchange2.Value + '" data-shape="' + exchange2.Shape + '" data-value="' + exchange2.Value + '"></li>');

 ot.$voteCheat.show();
 ot.$voteFair.show();
         }
         else {
             ot.$reviewContainer.hide();
             ot.$reviewMessage.hide();
             ot.$reviewDone.show();
         }
     },

     //TableState.
     //Any action on the table results to a TableState message responsible for the rendering of the table.
     TableState: function (message) {

         var

         status = message.Table.Status,
         players = message.Table.Players,
         scores = message.Table.RoundsRates,
         coins = message.Table.Coins,
         points = message.Table.TargetPoints,
         lastplayer = message.Table.LastPlayer,
         playerCount = message.Table.Players.length,
         playerPositions = {
             NorthPlayer: "",
             EastPlayer: "",
             SouthPlayer: "",
             WestPlayer: ""
         };
         //Find our player.
         var spectator = true;
         $(players).each(function () {
             if (this.Username == ot.$Username.val()) {
                 playerPositions.SouthPlayer = this;
                 spectator = false;
             }
         });
         //alert(bool);
         //if spectator
         if (spectator) {
             playerPositions.SouthPlayer = players[0];
             document.getElementById('autoFold').style.visibility = "hidden";
         }

         //Find all other players.
         for (var player in players) {
             if (players[player].Username != ot.$Username.val()) {
                 if ((players[player].Position + playerPositions.SouthPlayer.Position == 6 && playerPositions.SouthPlayer.Position != 3) || (players[player].Position + playerPositions.SouthPlayer.Position == 4 && playerPositions.SouthPlayer.Position != 2)) {
                     playerPositions.NorthPlayer = players[player];
                     ot.northPlayer = players[player].Position;
                 }
                 if ((players[player].Position == (playerPositions.SouthPlayer.Position - 1)) || ((players[player].Position == 4) && (playerPositions.SouthPlayer.Position == 1))) {
                     playerPositions.WestPlayer = players[player];
                     ot.westPlayer = players[player].Position;
                 }
                 if ((players[player].Position == (playerPositions.SouthPlayer.Position + 1)) || (((players[player].Position) == 1) && (playerPositions.SouthPlayer.Position == 4))) {
                     playerPositions.EastPlayer = players[player];
                     ot.eastPlayer = players[player].Position;
                 }
             }
         }

         playerPositions.NorthPlayer.Score = 0;
         playerPositions.EastPlayer.Score = 0;
         playerPositions.SouthPlayer.Score = 0;
         playerPositions.WestPlayer.Score = 0;

         playerPositions.NorthPlayer.ShortName = (playerPositions.NorthPlayer.Username == undefined) ? "" : playerPositions.NorthPlayer.Username.substring(0, 10);
         playerPositions.EastPlayer.ShortName = (playerPositions.EastPlayer.Username == undefined) ? "" : playerPositions.EastPlayer.Username.substring(0, 10);
         playerPositions.WestPlayer.ShortName = (playerPositions.WestPlayer.Username == undefined) ? "" : playerPositions.WestPlayer.Username.substring(0, 10);
         playerPositions.SouthPlayer.ShortName = (playerPositions.SouthPlayer.Username == undefined) ? "" : playerPositions.SouthPlayer.Username.substring(0, 10);

         //Add color to player names.
         ot.$northPlayerName.removeClass('p1Color p2Color p3Color p4Color').addClass('p' + playerPositions.NorthPlayer.Position + 'Color');
         ot.$westPlayerName.removeClass('p1Color p2Color p3Color p4Color').addClass('p' + playerPositions.WestPlayer.Position + 'Color');
         ot.$eastPlayerName.removeClass('p1Color p2Color p3Color p4Color').addClass('p' + playerPositions.EastPlayer.Position + 'Color');
         ot.$southPlayerName.removeClass('p1Color p2Color p3Color p4Color').addClass('p' + playerPositions.SouthPlayer.Position + 'Color');

         //Display the graphic amount of cards of all other players along with their Usernames.
         var appendCards = "";
         for (var i = 0; i < playerPositions.NorthPlayer.CardsCount; i++) {
             if (i == playerPositions.NorthPlayer.CardsCount - 1) {
                 appendCards += '<li class="cN ML">' + (i + 1) + '</li>';
             } else {
                 appendCards += '<li class="cN ML"></li>';
             }
         }
         ot.$northPlayer.html(appendCards);
         if (playerPositions.NorthPlayer.IsCheater) {
             ot.$northPlayerImage.html('<img border="0" src="' + ot.$table.data('cheatericon') + '" alt="" style="position:absolute;width:64px;height:64px" /><img src="' + ((playerPositions.NorthPlayer.Image == undefined) ? ot.$table.data('defaulticon') : ('https://www.gravatar.com/avatar/' + playerPositions.NorthPlayer.Image + '?s=256&d=identicon&r=PG')) + '" class="smallIcon" />');
         }
         else {
             ot.$northPlayerImage.html('<img src="' + ((playerPositions.NorthPlayer.Image == undefined) ? ot.$table.data('defaulticon') : ('https://www.gravatar.com/avatar/' + playerPositions.NorthPlayer.Image + '?s=256&d=identicon&r=PG')) + '" class="smallIcon" />');
         }
         ot.$northPlayerText.text((playerPositions.NorthPlayer.Username == undefined) ? "" : " " + playerPositions.NorthPlayer.ShortName);

         appendCards = "";
         for (var j = 0; j < playerPositions.WestPlayer.CardsCount; j++) {
             if (j == playerPositions.WestPlayer.CardsCount - 1) {
                 appendCards += '<li class="cN MR">' + (j + 1) + '</li>';
             } else {
                 appendCards += '<li class="cN MR"></li>';
             }
         }
         ot.$westPlayer.html(appendCards);
         if (playerPositions.WestPlayer.IsCheater) {
             ot.$westPlayerImage.html('<img border="0" src="' + ot.$table.data('cheatericon') + '" alt="" style="position:absolute;width:64px;height:64px" /><img src="' + ((playerPositions.WestPlayer.Image == undefined) ? ot.$table.data('defaulticon') : ('https://www.gravatar.com/avatar/' + playerPositions.WestPlayer.Image + '?s=256&d=identicon&r=PG')) + '" class="smallIcon" />');
         }
         else {
             ot.$westPlayerImage.html('<img src="' + ((playerPositions.WestPlayer.Image == undefined) ? ot.$table.data('defaulticon') : ('https://www.gravatar.com/avatar/' + playerPositions.WestPlayer.Image + '?s=256&d=identicon&r=PG')) + '" class="smallIcon" />');
         }
         ot.$westPlayerText.text((playerPositions.WestPlayer.Username == undefined) ? "" : " " + playerPositions.WestPlayer.ShortName);

         appendCards = "";
         for (var k = 0; k < playerPositions.EastPlayer.CardsCount; k++) {
             if (k == playerPositions.EastPlayer.CardsCount - 1) {
                 appendCards += '<li class="cN ML">' + (k + 1) + '</li>';
             } else {
                 appendCards += '<li class="cN ML"></li>';
             }
         }
         ot.$eastPlayer.html(appendCards);
         if (playerPositions.EastPlayer.IsCheater) {
             ot.$eastPlayerImage.html('<img border="0" src="' + ot.$table.data('cheatericon') + '" alt="" style="position:absolute;width:64px;height:64px" /><img src="' + ((playerPositions.EastPlayer.Image == undefined) ? ot.$table.data('defaulticon') : ('https://www.gravatar.com/avatar/' + playerPositions.EastPlayer.Image + '?s=256&d=identicon&r=PG')) + '" class="smallIcon" />');
         }
         else {
             ot.$eastPlayerImage.html('<img src="' + ((playerPositions.EastPlayer.Image == undefined) ? ot.$table.data('defaulticon') : ('https://www.gravatar.com/avatar/' + playerPositions.EastPlayer.Image + '?s=256&d=identicon&r=PG')) + '" class="smallIcon" />');
         }
         ot.$eastPlayerText.text((playerPositions.EastPlayer.Username == undefined) ? "" : " " + playerPositions.EastPlayer.ShortName);


         ot.HorizontalAlign(ot.$northPlayerName);
         ot.HorizontalAlign(ot.$northPlayer);
         ot.HorizontalAlign($('#northPlayerMenu'));

         //Hide the "ask for card" bar.
         ot.$askCards.hide();

         if (spectator == false) {
             //Render player's cards.
             var displayCardsHtmlString = "";
             $(playerPositions.SouthPlayer.Cards).each(function () {
                 //if ($('#southPlayerPass #c' + this.Shape + '-' + this.Value).length) {

                 //} else {
                 displayCardsHtmlString += '<li id="c' + this.Shape + '-' + this.Value + '" class="card c' + this.Shape + '-' + this.Value + '" data-shape="' + this.Shape + '" data-value="' + this.Value + '"></li>';
                 //}
                 //if ((this.Shape == 4) && ((status === 'FirstPlaying') || (status === 'Playing'))) {
                 //    ot.$askCards.show();
                 //}
             });

             ot.$bombs.innerHTML = "";
             displayBombsHtmlString = "";
             var index = 0;
             $(playerPositions.SouthPlayer.Bombs).each(function () {
                 displayBombsHtmlString += "<li style='list-style-type: none;margin-left: 5px;'><ul id='bomb_" + index + "' class='horizontalLayoutSmall list-unstyled'>";
                 $(this).each(function () {
                     displayBombsHtmlString += '<li id="sc' + this.Shape + '-' + this.Value + '" class="smallcard sc' + this.Shape + '-' + this.Value + '" data-shape="' + this.Shape + '" data-value="' + this.Value + '"></li>';
                 });
                 displayBombsHtmlString += "</ul></li>";
                 index++;
             })

             if (displayBombsHtmlString === "") {
                 displayBombsHtmlString = "<h5 style='color: white;margin-left: 5px;'><b>No Bombs! <i class='emote-sad'></i></b></h5>";
             }

             //console.log(displayBombsHtmlString);
             ot.$bombs.html(displayBombsHtmlString);
             ot.$southPlayer.html(displayCardsHtmlString);
             ot.HorizontalAlign(ot.$southPlayer);
             if (playerPositions.SouthPlayer.IsCheater) {
                 ot.$southPlayerImage.html('<img border="0" src="' + ot.$table.data('cheatericon') + '" alt="" style="position:absolute;width:64px;height:64px" /><img src="' + ((playerPositions.SouthPlayer.Image == undefined) ? ot.$table.data('defaulticon') : ('https://www.gravatar.com/avatar/' + playerPositions.SouthPlayer.Image + '?s=256&d=identicon&r=PG')) + '" class="smallIcon" />');
             }
             else {
                 ot.$southPlayerImage.html('<img src="' + ((playerPositions.SouthPlayer.Image == undefined) ? ot.$table.data('defaulticon') : ('https://www.gravatar.com/avatar/' + playerPositions.SouthPlayer.Image + '?s=256&d=identicon&r=PG')) + '" class="smallIcon" />');
             }
             ot.$southPlayerText.text((playerPositions.SouthPlayer.Username == undefined) ? "" : " " + playerPositions.SouthPlayer.ShortName);
             ot.HorizontalAlign(ot.$southPlayerName);
         }
         else {
             //Display the graphic amount of cards of south player if i am A Spectator
             appendCards = "";
             for (var k = 0; k < playerPositions.SouthPlayer.CardsCount; k++) {
                 if (k == playerPositions.SouthPlayer.CardsCount - 1) {
                     appendCards += '<li class="cN ML">' + (k + 1) + '</li>';
                 } else {
                     appendCards += '<li class="cN ML"></li>';
                 }
             }
             ot.$southPlayer.html(appendCards);
             ot.HorizontalAlign(ot.$southPlayer);
             if (playerPositions.SouthPlayer.IsCheater) {
                 ot.$southPlayerImage.html('<img border="0" src="' + ot.$table.data('cheatericon') + '" alt="" style="position:absolute;width:64px;height:64px" /><img src="' + ((playerPositions.SouthPlayer.Image == undefined) ? ot.$table.data('defaulticon') : ('https://www.gravatar.com/avatar/' + playerPositions.SouthPlayer.Image + '?s=256&d=identicon&r=PG')) + '" class="smallIcon" />');
             }
             else {
                 ot.$southPlayerImage.html('<img src="' + ((playerPositions.SouthPlayer.Image == undefined) ? ot.$table.data('defaulticon') : ('https://www.gravatar.com/avatar/' + playerPositions.SouthPlayer.Image + '?s=256&d=identicon&r=PG')) + '" class="smallIcon" />');
             }
             ot.$southPlayerText.text((playerPositions.SouthPlayer.Username == undefined) ? "" : " " + playerPositions.SouthPlayer.ShortName);
             ot.HorizontalAlign(ot.$southPlayerName);
         }

         //Render stack cards.
         displayCardsHtmlString = "";
         $(message.Table.TableCards).each(function () {
             var value = this.Value;
             if (this.Shape == 7) {
                 value = 0;
             }
             displayCardsHtmlString += '<li id="c' + this.Shape + '-' + value + '" class="card c' + this.Shape + '-' + value + '" data-shape="' + this.Shape + '" data-value="' + value + '"></li>';
         });

         ot.$tableCards.html(displayCardsHtmlString);

         if (message.Table.TableCards.length > 9) {
             $('.horizontalLayouta .card').css('margin-left', '-64px');
             $('#tableCards').css('margin-left', '32px');
         } else {
             $('.horizontalLayouta .card').css('margin-left', '-50px');
             $('#tableCards').css('margin-left', '25px');
         }

         ot.HorizontalAlign(ot.$tableCards);

         //Inform players about the value of an asked card.
         if (message.Table.AskedCard) {
             if (message.Table.AskedCard.Value == 11) {
                 ot.$gameMessage.text(ot.$gameMessage.data('askedcard') + " J");
             }
             else if (message.Table.AskedCard.Value == 12) {
                 ot.$gameMessage.text(ot.$gameMessage.data('askedcard') + " Q");
             }
             else if (message.Table.AskedCard.Value == 13) {
                 ot.$gameMessage.text(ot.$gameMessage.data('askedcard') + " K");
             }
             else if (message.Table.AskedCard.Value == 14) {
                 ot.$gameMessage.text(ot.$gameMessage.data('askedcard') + " A");
             }
             else {
                 ot.$gameMessage.text(ot.$gameMessage.data('askedcard') + " " + message.Table.AskedCard.Value);
             }
         } else {
             ot.$gameMessage.text('');
         }

         ot.HorizontalAlign(ot.$gameMessage);

         //Displays the Call Tichu button at a valid moment.
         if ((status !== 'Created') && (status !== 'WaitForStart') && (status !== 'WaitForNextCards') && (playerPositions.SouthPlayer.GrandTichu == false) && (playerPositions.SouthPlayer.Tichu == false) && (ot._southPlayerCards().length == 14)) {
             ot.$callTichu.show();
         } else {
             ot.$callTichu.hide();
         }

         //Golds - Tournaments.
         ot.$northPlayerGoldTourns.html('');
         ot.$westPlayerGoldTourns.html('');
         ot.$eastPlayerGoldTourns.html('');
         ot.$southPlayerGoldTourns.html('');

         //Ratings - Levels.
         ot.$northPlayerLevel.html('');
         ot.$westPlayerLevel.html('');
         ot.$eastPlayerLevel.html('');
         ot.$southPlayerLevel.html('');

         if (playerPositions.NorthPlayer) {
             ot.$northPlayerLevel.html('L ' + playerPositions.NorthPlayer.Level + ' - R ' + playerPositions.NorthPlayer.Rating);
             ot.$northPlayerGoldTourns.html('G ' + playerPositions.NorthPlayer.GoldWins + ' - T ' + playerPositions.NorthPlayer.TournamentWins);
         }

         if (playerPositions.EastPlayer) {
             ot.$eastPlayerLevel.html('L ' + playerPositions.EastPlayer.Level + ' - R ' + playerPositions.EastPlayer.Rating);
             ot.$eastPlayerGoldTourns.html('G ' + playerPositions.EastPlayer.GoldWins + ' - T ' + playerPositions.EastPlayer.TournamentWins);
         }

         if (playerPositions.WestPlayer) {
             ot.$westPlayerLevel.html('L ' + playerPositions.WestPlayer.Level + ' - R ' + playerPositions.WestPlayer.Rating);
             ot.$westPlayerGoldTourns.html('G ' + playerPositions.WestPlayer.GoldWins + ' - T ' + playerPositions.WestPlayer.TournamentWins);
         }

         if (playerPositions.SouthPlayer) {
             ot.$southPlayerLevel.html('L ' + playerPositions.SouthPlayer.Level + ' - R ' + playerPositions.SouthPlayer.Rating);
             ot.$southPlayerGoldTourns.html('G ' + playerPositions.SouthPlayer.GoldWins + ' - T ' + playerPositions.SouthPlayer.TournamentWins);
         }

         //Displays GT or T.
         ot.$northPlayerTichu.html('');
         ot.$westPlayerTichu.html('');
         ot.$eastPlayerTichu.html('');
         ot.$southPlayerTichu.html('');

         if (playerPositions.WestPlayer.GrandTichu == true) {
             ot.$westPlayerTichu.html('Grand Tichu');
             if (window.matchMedia("(max-width: 768px)").matches) {
                 ot.$westPlayerGoldTourns.html('');//den xwrane ola
             }
         }
         if (playerPositions.WestPlayer.Tichu == true) {
             ot.$westPlayerTichu.html('Tichu');
             if (window.matchMedia("(max-width: 768px)").matches) {
                 ot.$westPlayerGoldTourns.html('');//den xwrane ola
             }
         }

         if (playerPositions.EastPlayer.GrandTichu == true) {
             ot.$eastPlayerTichu.html('Grand Tichu');
             if (window.matchMedia("(max-width: 768px)").matches) {
                 ot.$eastPlayerGoldTourns.html('');//den xwrane ola
             }
         }
         if (playerPositions.EastPlayer.Tichu == true) {
             ot.$eastPlayerTichu.html('Tichu');
             if (window.matchMedia("(max-width: 768px)").matches) {
                 ot.$eastPlayerGoldTourns.html('');//den xwrane ola
             }
         }

         if (playerPositions.NorthPlayer.GrandTichu == true) {
             ot.$northPlayerTichu.html('Grand Tichu');
             if (window.matchMedia("(max-width: 768px)").matches) {
                 ot.$northPlayerGoldTourns.html('');//den xwrane ola
             }
         }
         if (playerPositions.NorthPlayer.Tichu == true) {
             ot.$northPlayerTichu.html('Tichu');
             if (window.matchMedia("(max-width: 768px)").matches) {
                 ot.$northPlayerGoldTourns.html('');//den xwrane ola
             }
         }

         if (playerPositions.SouthPlayer.GrandTichu == true) {
             ot.$southPlayerTichu.html('Grand Tichu');
             if (window.matchMedia("(max-width: 768px)").matches) {
                 ot.$southPlayerGoldTourns.html('');//den xwrane ola
             }
         }
         if (playerPositions.SouthPlayer.Tichu == true) {
             ot.$southPlayerTichu.html('Tichu');
             if (window.matchMedia("(max-width: 768px)").matches) {
                 ot.$southPlayerGoldTourns.html('');//den xwrane ola
             }
         }

         //Scores.
         if (spectator) {
             ot.$scores.html('<table id="scoreTable"><tr><th style="text-align: center;">Team 1</th><th style="text-align: center;">Team 2</th></tr><tr id="totalScore"><td id="yourTeamTotal"></td><td id="opTeamTotal"></td></tr></table>');
         }
         else {
             ot.$scores.html('<table id="scoreTable"><tr><th style="text-align: center;">Your Team</th><th style="text-align: center;">Op Team</th></tr><tr id="totalScore"><td id="yourTeamTotal"></td><td id="opTeamTotal"></td></tr></table>');
         }

         ot.$scoreDetails.html('<table id="scoreDetailsTable"><tr><th style="text-align: center;">__________</th><th style="text-align: center;">__________</th></tr></table>');

         for (var round in scores) {
             var thisRound = scores[round];
             if (!thisRound.ActiveRound) {
                 var n, s, w, e;
                 for (var playerRate in thisRound.PlayerRates) {
                     var thisPlayer = thisRound.PlayerRates[playerRate];
                     if (thisPlayer.Position == playerPositions.SouthPlayer.Position) {
                         playerPositions.SouthPlayer.Score += thisPlayer.Points;
                         s = thisPlayer.Points;
                     }
                     if (thisPlayer.Position == playerPositions.EastPlayer.Position) {
                         playerPositions.EastPlayer.Score += thisPlayer.Points;
                         e = thisPlayer.Points;
                     }
                     if (thisPlayer.Position == playerPositions.NorthPlayer.Position) {
                         playerPositions.NorthPlayer.Score += thisPlayer.Points;
                         n = thisPlayer.Points;
                     }
                     if (thisPlayer.Position == playerPositions.WestPlayer.Position) {
                         playerPositions.WestPlayer.Score += thisPlayer.Points;
                         w = thisPlayer.Points;
                     }
                 }

                 $('#scoreDetailsTable').append('<tr><td>' + (n + s) + '</td><td>' + (w + e) + '</td></tr>');
             }
         }

         var team1 = playerPositions.SouthPlayer.Score + playerPositions.NorthPlayer.Score;
         var team2 = playerPositions.WestPlayer.Score + playerPositions.EastPlayer.Score;

         $('#yourTeamTotal').html((isNaN(team1)) ? 0 : team1);
         $('#opTeamTotal').html((isNaN(team2)) ? 0 : team2);

         if (spectator) {
         }
         else if (team1 > team2) {
             ot.$scores[0].style.backgroundColor = "lightgreen";
         }
         else if (team1 < team2) {
             ot.$scores[0].style.backgroundColor = "salmon";
         }
         else if (team1 === team2) {
             ot.$scores[0].style.backgroundColor = "white";
         }

         //ot.$pointsLabelInner.html(points);

         //if (coins == 0) {
         //	ot.$coinsLabel.hide();
         //} else {
         //	ot.$coinsLabelInner.html(coins);
         //}

         UpdateSpectators(message.Table, spectator);

         ot.$loading.hide();

         ot.playerPositions = playerPositions;

         if (playerCount != 4) {
             ot.$startTable.hide();
             //ot.$restartTable.show();
             ot.$nextCards.hide();
             ot.$callGrandTichu.hide();
             ot.$exchangeCards.hide();
             ot.$exchangedCards.hide();
             ot.$callTichu.hide();
             ot._exchangeCard.hide();
             ot.$playTurn.hide();
             ot.$playBomb.hide();
             ot.$gameMessage.text('');

             ot.$fold.hide();
         }

         ot.$northPlayerName.unbind('hover');
         $('#northPlayerMenu').unbind('hover');
         $('#northProfile').unbind('click');
         $('#northKick').unbind('click');
         $('#northSystemKick').unbind('click');
         if (spectator == false) {
             if (playerPositions.NorthPlayer.Username !== undefined) {
                 $('#northProfile').click(function () {
                     window.open(ot.$globalOnlineUsersContainer.data('url') + playerPositions.NorthPlayer.Username, '_blank');
                     window.focus();
                 });
                 $('#northKick').click(function () {
                     ot.action.KickPlayer(playerPositions.NorthPlayer.Position);
                 });
                 $('#northSystemKick').click(function () {
                     ot.action.SystemKickPlayer(playerPositions.NorthPlayer.Position);
                 });
                 ot.$northPlayerName.hover(function () {
                     $('#northPlayerMenu').fadeIn('400');
                 }).mouseleave(function () {
                     setTimeout(function () {
                         $('#northPlayerMenu').fadeOut('400');
                     }, 5000)
                 });
                 $('#northPlayerMenu').mouseleave(function () {
                     $('#northPlayerMenu').fadeOut('400');
                 });
             }
         }
         ot.$eastPlayerName.unbind('hover');
         $('#eastPlayerMenu').unbind('hover');
         $('#eastProfile').unbind('click');
         $('#eastKick').unbind('click');
         $('#eastSystemKick').unbind('click');
         if (spectator == false) {
             if (playerPositions.EastPlayer.Username !== undefined) {
                 $('#eastProfile').click(function () {
                     window.open(ot.$globalOnlineUsersContainer.data('url') + playerPositions.EastPlayer.Username, '_blank');
                     window.focus();
                 });
                 $('#eastKick').click(function () {
                     ot.action.KickPlayer(playerPositions.EastPlayer.Position);
                 });
                 $('#eastSystemKick').click(function () {
                     ot.action.SystemKickPlayer(playerPositions.EastPlayer.Position);
                 });
                 ot.$eastPlayerName.hover(function () {
                     $('#eastPlayerMenu').fadeIn('400');
                 }).mouseleave(function () {
                     setTimeout(function () {
                         $('#eastPlayerMenu').fadeOut('400');
                     }, 5000)
                 });
                 $('#eastPlayerMenu').mouseleave(function () {
                     $('#eastPlayerMenu').fadeOut('400');
                 });
             }
         }
         ot.$westPlayerName.unbind('hover');
         $('#westPlayerMenu').unbind('hover');
         $('#westProfile').unbind('click');
         $('#westKick').unbind('click');
         $('#westSystemKick').unbind('click');
         if (spectator == false) {
             if (playerPositions.WestPlayer.Username !== undefined) {
                 $('#westProfile').click(function () {
                     window.open(ot.$globalOnlineUsersContainer.data('url') + playerPositions.WestPlayer.Username, '_blank');
                     window.focus();
                 });
                 $('#westKick').click(function () {
                     ot.action.KickPlayer(playerPositions.WestPlayer.Position);
                 });
                 $('#westSystemKick').click(function () {
                     ot.action.SystemKickPlayer(playerPositions.WestPlayer.Position);
                 });
                 ot.$westPlayerName.hover(function () {
                     $('#westPlayerMenu').fadeIn('400');
                 }).mouseleave(function () {
                     setTimeout(function () {
                         $('#westPlayerMenu').fadeOut('400');
                     }, 5000)
                 });
                 $('#westPlayerMenu').mouseleave(function () {
                     $('#westPlayerMenu').fadeOut('400');
                 });
             }
         }

         if (status != "Created" && status != "WaitForStart") {
             setStartedDateTime(message.Table.StartedDateTime, message.Table.CurrentDateTime);

             if (message.Table.ExchangeUntil == null) {
                 clearExchangeUntil();
             }
             else {
                 setExchangeUntil(message.Table.ExchangeUntil);
             }

             if (message.Table.PlayTurnUntil == null && message.Table.NextUntil == null && message.Table.GiveDragonUntil == null) {
                 clearPlayerTurnDateTimeUntil();
             }
             else if (message.Table.PlayTurnUntil != null) {
                 setPlayerTurnDateTimeUntil(message.Table.PlayTurnUntil);
             }
             else if (message.Table.NextUntil != null) {
                 setPlayerTurnDateTimeUntil(message.Table.NextUntil);
             }
             else if (message.Table.GiveDragonUntil != null) {
                 setPlayerTurnDateTimeUntil(message.Table.GiveDragonUntil);
             }
         }
         else {
             setStartedDateTime(null, null);
         }

         //Rendering of conditional table state messages responsible to display in game controlls and messages.
         switch (status) {
             case "Created":
                 ot.$southPlayer.html('');
                 //ot.$restartTable.hide();
                 ot.$startTable.hide();
                 ot.$voteRestart.hide();
                 ot.$nextCards.hide();
                 ot.$callGrandTichu.hide();
                 ot.$exchangeCards.hide();
                 ot.$exchangedCards.hide();
                 ot.$callTichu.hide();
                 ot._exchangeCard.hide();
                 ot.$playTurn.hide();
                 ot.$playBomb.hide();
                 ot.$fold.hide();
                 ot.$bombs.innerHTML = "";
                 ot.$westPlayerName.unbind('click');
                 ot.$northPlayerName.unbind('click');
                 ot.$eastPlayerName.unbind('click');

                 if (playerPositions.WestPlayer.Username == undefined) {
                     ot.$westPlayerText.text(' ' + ot.$table.data('sithere'));
                     ot.$westPlayerName.click(function () {
                         ot.action.ChangePosition(playerPositions.SouthPlayer.Position, 'West');
                     });
                 }

                 if (playerPositions.NorthPlayer.Username == undefined) {
                     ot.$northPlayerText.text(' ' + ot.$table.data('sithere'));
                     ot.$northPlayerName.click(function () {
                         ot.action.ChangePosition(playerPositions.SouthPlayer.Position, 'North');
                     });
                 }

                 if (playerPositions.EastPlayer.Username == undefined) {
                     ot.$eastPlayerText.text(' ' + ot.$table.data('sithere'));
                     ot.$eastPlayerName.click(function () {
                         ot.action.ChangePosition(playerPositions.SouthPlayer.Position, 'East');
                     });
                 }

                 break;
             case "WaitForStart":
                 ot.$bombs.innerHTML = "";
                 ot.$startTable.show();
                 ot.$voteRestart.hide();
                 //ot.$restartTable.hide();
                 ot.$nextCards.hide();
                 ot.$callGrandTichu.hide();
                 ot.$exchangeCards.hide();
                 ot.$exchangedCards.hide();
                 ot.$callTichu.hide();
                 ot._exchangeCard.hide();
                 ot.$westPlayerName.unbind('click');
                 ot.$northPlayerName.unbind('click');
                 ot.$eastPlayerName.unbind('click');
                 ot.$playTurn.hide();
                 ot.$playBomb.hide();
                 ot.$fold.hide();
                 ot.$southPlayer.html('');
                 ot.$eastPlayer.html('');
                 ot.$westPlayer.html('');
                 ot.$northPlayer.html('');
                 $('.highlightgreen').removeClass('highlightgreen');
                 $('.highlightyellow').removeClass('highlightyellow');
                 $('#readySound')[0].play();
                 break;
             case "WaitForNextCards":
                 ot.$bombs.innerHTML = "";
                 ot.$voteRestart.show();
                 ot.$startTable.hide();
                 //ot.$restartTable.show();
                 ot.$exchangeCards.hide();
                 ot.$exchangedCards.hide();
                 ot.$callTichu.hide();
                 ot._exchangeCard.hide();
                 ot.$playTurn.hide();
                 ot.$playBomb.hide();
                 ot.$fold.hide();
                 $('.highlightgreen').removeClass('highlightgreen');
                 $('.highlightyellow').removeClass('highlightyellow');
                 if (playerPositions.SouthPlayer.Status == 'BeforeNextCards') {
                     ot.$nextCards.show();
                     ot.$callGrandTichu.show();
                 }
                 if (playerPositions.SouthPlayer.Status == 'AfterNextCards') {
                     ot.$nextCards.hide();
                     ot.$callGrandTichu.hide();
                 }
                 if (playerCount != 4) {
                     ot.$nextCards.hide();
                     ot.$callGrandTichu.hide();
                 }

                 if (playerPositions.EastPlayer.Status == 'BeforeNextCards') {
                     ot.$eastPlayerImage.append('<div id="timer1" class="timer"></div>');
                 }
                 if (playerPositions.NorthPlayer.Status == 'BeforeNextCards') {
                     ot.$northPlayerImage.append('<div id="timer2" class="timer"></div>');
                 }
                 if (playerPositions.WestPlayer.Status == 'BeforeNextCards') {
                     ot.$westPlayerImage.append('<div id="timer3" class="timer"></div>');
                 }
                 if (playerPositions.SouthPlayer.Status == 'BeforeNextCards') {
                     ot.$southPlayerImage.append('<div id="timer4" class="timer"></div>');
                 }

                 break;
             case "WaitForExchange":
                 ot.$bombs.innerHTML = "";
                 ot.$voteRestart.show();
                 ot.$playTurn.hide();
                 ot.$playBomb.hide();
                 ot.$fold.hide();
                 ot.$westExchange.html('');
                 ot.$northExchange.html('');
                 ot.$eastExchange.html('');
                 ot._southPlayerCards().unbind('click');
                 ot.$passCards().unbind('click');
                 if (playerPositions.SouthPlayer.Status == 'AfterNextCards') {
                     ot.$exchangeCards.show();

                     var chosenCard = null;

                     ot._southPlayerCards().off('click');
                     ot._southPlayerCards().on('click', function () {
                         if ($(this).hasClass('.cardForExchange')) {
                             return;
                         }
                         if ($(this).hasClass('chosenCard')) {
                             $(this).removeClass('chosenCard');
                             chosenCard = null;
                         } else {
                             $('.chosenCard').removeClass('chosenCard');
                             $(this).addClass('chosenCard');
                             chosenCard = $(this);
                         }
                     });

                     ot._exchangeCard.unbind('click');
                     ot._exchangeCard.show().click(function () {
                         //alert(chosenCard);
                         if (chosenCard != null) {
                             $(this).children('li:nth-child(1)').removeClass('.cardForExchange');
                             $(this).children('li:nth-child(1)').appendTo(ot.$southPlayer);
                             chosenCard.removeClass('chosenCard').appendTo(this);
                             chosenCard.addClass('.cardForExchange');
                             ot.HorizontalAlign(ot.$southPlayer);
                             chosenCard = null;
                             return false;
                         }
                     });
                 }
                 if (playerPositions.SouthPlayer.Status == 'AfterExchangeCards') {
                     ot.$exchangeCards.hide();
                     ot._exchangeCard.hide().unbind('click');
                     ot._southPlayerCards().off('click');
                 }

                 if (playerCount != 4) {
                     ot._exchangeCard.hide();
                     ot.$exchangeCards.hide();
                     ot.$callTichu.hide();
                     ot.$callGrandTichu.hide();
                 }

                 if (playerPositions.EastPlayer.Status == 'AfterNextCards') {
                     ot.$eastPlayerImage.append('<div id="timer1" class="timer"></div>');
                 }
                 if (playerPositions.NorthPlayer.Status == 'AfterNextCards') {
                     ot.$northPlayerImage.append('<div id="timer2" class="timer"></div>');
                 }
                 if (playerPositions.WestPlayer.Status == 'AfterNextCards') {
                     ot.$westPlayerImage.append('<div id="timer3" class="timer"></div>');
                 }
                 if (playerPositions.SouthPlayer.Status == 'AfterNextCards') {
                     ot.$southPlayerImage.append('<div id="timer4" class="timer"></div>');
                 }

                 break;
                 case "FirstPlaying":
                     var table = '<table cellpadding="5" cellspacing="0" style="margin-left:auto;margin-right:auto;text-align:center;padding:5px;"><tr><td>' + playerPositions.WestPlayer.ShortName + '</td><td>' + playerPositions.NorthPlayer.ShortName + '</td><td>' + playerPositions.EastPlayer.ShortName + '</td></tr><tr><td><div class="card c' + playerPositions.SouthPlayer.ExCards[2].Shape + '-' + playerPositions.SouthPlayer.ExCards[2].Value + '"></div></td><td><div class="card c' + playerPositions.SouthPlayer.ExCards[1].Shape + '-' + playerPositions.SouthPlayer.ExCards[1].Value + '"></div></td><td><div class="card c' + playerPositions.SouthPlayer.ExCards[0].Shape + '-' + playerPositions.SouthPlayer.ExCards[0].Value + '"></div></td></tr></table>';
                     ot.$voteRestart.show();
                     ot.$exchangedCards.html(table);
                     ot.HorizontalAlign(ot.$exchangedCards);
                     ot.$exchangedCards.show().delay('4000').fadeOut();
                 case "Playing":

                     $(ot.chosenCards.slice(0, -1)).addClass('chosenCard');

                     ot.$voteRestart.show();
                     ot.$westPlayerName.removeClass('highlightyellow');
                     ot.$eastPlayerName.removeClass('highlightyellow');
                     ot.$southPlayerName.removeClass('highlightyellow');
                     ot.$northPlayerName.removeClass('highlightyellow');

                     if (playerPositions.NorthPlayer.Position == lastplayer) {
                         ot.$northPlayerName.addClass('highlightyellow');
                     }

                     if (playerPositions.SouthPlayer.Position == lastplayer) {
                         ot.$southPlayerName.addClass('highlightyellow');
                     }

                     if (playerPositions.EastPlayer.Position == lastplayer) {
                         ot.$eastPlayerName.addClass('highlightyellow');
                     }

                     if (playerPositions.WestPlayer.Position == lastplayer) {
                         ot.$westPlayerName.addClass('highlightyellow');
                     }

                     ot.$playTurn.show();
                     ot.$playBomb.show();
                     ot.$fold.show();

                     ot._southPlayerCards().off('click');
                     ot._southPlayerCards().bind('click', function () {
                         if ($(this).hasClass('chosenCard')) {
                             $(this).removeClass('chosenCard');
                             ot.chosenCards = ot.chosenCards.replace('#' + $(this).attr('id') + ',', '');

                             if ($(this).hasClass('c4-1')) {
                                 ot.$askCards.hide();
                             }
                         } else {
                             $(this).addClass('chosenCard');
                             ot.chosenCards += '#' + $(this).attr('id') + ',';

                             if ($(this).hasClass('c4-1')) {
                                 ot.$askCards.show();
                             }
                         }
                         // console.log(ot.chosenCards.slice(0, -1));
                     });

                     ot.$northPlayerName.removeClass('bold').removeClass('highlightgreen');
                     ot.$westPlayerName.removeClass('bold').removeClass('highlightgreen');
                     ot.$eastPlayerName.removeClass('bold').removeClass('highlightgreen');
                     ot.$southPlayerName.removeClass('bold').removeClass('highlightgreen');
                     //ot.$gameField.removeClass('youPlayBorder');

                     switch (message.Table.Turn) {
                         case playerPositions.NorthPlayer.Position:
                             ot.$gameLog.append('<strong style="color: green;">' + playerPositions.NorthPlayer.Username + ' ' + ot.$table.data('plays') + '.</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                             ot.$northPlayerName.addClass('bold').removeClass('highlightyellow').addClass('highlightgreen');
                             ot.$playTurn.removeClass('btn-success');
                             ot.$northPlayerImage.append('<div id="timer2" class="timer"></div>');
                             ot.$fold.hide();
                             break;
                         case playerPositions.EastPlayer.Position:
                             ot.$gameLog.append('<strong style="color: green;">' + playerPositions.EastPlayer.Username + ' ' + ot.$table.data('plays') + '.</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                             ot.$eastPlayerName.addClass('bold').removeClass('highlightyellow').addClass('highlightgreen');
                             ot.$playTurn.removeClass('btn-success');
                             ot.$fold.hide();
                             ot.$eastPlayerImage.append('<div id="timer1" class="timer"></div>');
                             break;
                         case playerPositions.WestPlayer.Position:
                             ot.$gameLog.append('<strong style="color: green;">' + playerPositions.WestPlayer.Username + ' ' + ot.$table.data('plays') + '.</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                             ot.$westPlayerName.addClass('bold').removeClass('highlightyellow').addClass('highlightgreen');
                             ot.$playTurn.removeClass('btn-success');
                             ot.$fold.hide();
                             ot.$westPlayerImage.append('<div id="timer3" class="timer"></div>');
                             break;
                         case playerPositions.SouthPlayer.Position:
                             if (spectator) {
                                 ot.$gameLog.append('<strong style="color: green;">' + playerPositions.SouthPlayer.Username + ' ' + ot.$table.data('plays') + '.</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                                 ot.$southPlayerName.addClass('bold').removeClass('highlightyellow').addClass('highlightgreen');
                                 ot.$playTurn.removeClass('btn-success');
                                 ot.$fold.hide();
                             }
                             else {
                                 if (playerPositions.SouthPlayer.MustFold && ot.AutoFold) {
                                     ot.action.Fold();
                                 } else if (playerCount == 4) {
                                     ot.$gameLog.append('<strong style="color: green;">' + ot.$table.data('youplay') + '!</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                                     ot.$southPlayerName.addClass('bold').removeClass('highlightyellow').addClass('highlightgreen');
                                     ot.$playTurn.addClass('btn-success');
                                     ot.$fold.show();
                                     //$('#tichuContainerMessage').html(ot.$table.data('youplay') + '!');
                                     //$('#tichuContainer').fadeIn(500).fadeOut(500);
                                     $('#playSound')[0].play();
                                     ot.TitleAlert(ot.$table.data('youplay') + '!');
                                     //ot.$gameField.addClass('youPlayBorder');
                                 }
                             }
                             ot.$southPlayerImage.append('<div id="timer4" class="timer"></div>');
                             break;
                         case -1:
                             ot.$askCards.hide();
                             ot.$phoenixCards.hide();
                             ot.$playTurn.hide();
                             ot.$playBomb.hide();
                             ot.$fold.hide();
                             break;
                     }

                     if (playerCount != 4) {
                         ot.$askCards.hide();
                         ot.$phoenixCards.hide();
                         ot.$playTurn.hide();
                         ot.$playBomb.hide();
                         ot.$fold.hide();
                         ot.$gameMessage.text('');
                         ot._exchangeCard.hide();
                         ot.$northExchange.html('');
                         ot.$eastExchange.html('');
                         ot.$westExchange.html('');
                         ot.$southPlayer.html('');
                         ot.$tableCards.html('');
                         $('.highlightgreen').removeClass('highlightgreen');
                         $('.highlightyellow').removeClass('highlightyellow');
                     }
                     break;
                         case "GiveDragon":
                             if (spectator) {
                             }
                             else {
                                 ot.$voteRestart.show();
                                 ot.$playTurn.hide();
                                 ot.$playBomb.hide();
                                 ot.$fold.hide();
                                 ot.$westPlayerName.removeClass('bold').removeClass('highlightgreen');
                                 ot.$eastPlayerName.removeClass('bold').removeClass('highlightgreen');
                                 switch (message.Table.LastPlayer) {
                                     case playerPositions.NorthPlayer.Position:
                                         ot.$gameLog.append('<strong style="color: blue;">' + playerPositions.NorthPlayer.Username + ' ' + ot.$gameLog.data('givesthedragon') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                                         ot.$northPlayerName.addClass('bold');
                                         ot.$northPlayerImage.append('<div id="timer2" class="timer"></div>');
                                         break;
                                     case playerPositions.EastPlayer.Position:
                                         ot.$gameLog.append('<strong style="color: blue;">' + playerPositions.EastPlayer.Username + ' ' + ot.$gameLog.data('givesthedragon') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                                         ot.$eastPlayerName.addClass('bold');
                                         ot.$eastPlayerImage.append('<div id="timer1" class="timer"></div>');
                                         break;
                                     case playerPositions.WestPlayer.Position:
                                         ot.$gameLog.append('<strong style="color: blue;">' + playerPositions.WestPlayer.Username + ' ' + ot.$gameLog.data('givesthedragon') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                                         ot.$westPlayerName.addClass('bold');
                                         ot.$westPlayerImage.append('<div id="timer3" class="timer"></div>');
                                         break;
                                     case playerPositions.SouthPlayer.Position:
                                         ot.$southPlayerImage.append('<div id="timer4" class="timer"></div>');
                                         ot.$gameLog.append('<strong style="color: blue;">' + ot.$table.data('givedragon') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                                         ot.$westPlayerName.addClass('highlightblue').click(function () {
                                             ot.action.GiveDragon(ot.westPlayer);
                                             $(this).unbind('click').removeClass('highlightblue');
                                             ot.$eastPlayerName.unbind('click').removeClass('highlightblue');
                                         });
                                         ot.$eastPlayerName.addClass('highlightblue').click(function () {
                                             ot.action.GiveDragon(ot.eastPlayer);
                                             $(this).unbind('click').removeClass('highlightblue');
                                             ot.$westPlayerName.unbind('click').removeClass('highlightblue');
                                         });
                                         ot.TitleAlert(ot.$table.data('givedragon') + '!');
                                         break;
                                 }
                             }
                             break;
         }
         if (spectator) {
             ot.$voteRestart.hide();
             ot.$startTable.hide();
             ot.$nextCards.hide();
             ot.$callGrandTichu.hide();
             ot.$exchangeCards.hide();
             ot.$exchangedCards.hide();
             ot.$callTichu.hide();
             ot._exchangeCard.hide();
             ot.$playTurn.hide();
             ot.$playBomb.hide();
             ot.$fold.hide();
             ot.$westPlayerName.unbind('click');
             ot.$northPlayerName.unbind('click');
             ot.$eastPlayerName.unbind('click');
             //alert(1);
             ot.$southPlayer.removeClass('southPlayer').addClass('southPlayerS');
             ot.$westPlayer.removeClass('westPlayer').addClass('westPlayerS');
             ot.$westPlayerName.removeClass('westPlayerName').addClass('westPlayerNameS');
             ot.$eastPlayer.removeClass('eastPlayer').addClass('eastPlayerS');
             ot.$eastPlayerName.removeClass('eastPlayerName').addClass('eastPlayerNameS');
             //alert(2);
         }
     },

     //Spectators
     Spectators: function (message) {

         var spectator = true;
         $(message.Table.Players).each(function () {
             if (this.Username == ot.$Username.val()) {
                 spectator = false;
             }
         });

         UpdateSpectators(message.Table, spectator);
     },

     Achievement: function (message) {
         //$('#achievementSound')[0].play();
         var time = 0;
         var id = 0;

         $('#mainAchievementContainer').empty();

         for (var a in message.UserAchievements) {
             var imgName = 'level1.png';

             for (i = 0; i <= 2; i++) {
                 if (message.UserAchievements[a].AchievementID <= (i * 100) + 100) {
                     switch (message.UserAchievements[a].Level) {
                         case 2:
                         case 3:
                         case 4:
                         case 5:
                             imgName = 'achievement' + (i * 100 + message.UserAchievements[a].Level) + '.png';
                             break;
                         default:
                             break;
                     }
                     break;
                 }
             }
             //$('#achievementImg').innerHTML = "";
             //$('#achievementLbl').innerHTML = "";
             $('#mainAchievementContainer').append("<div id='achievementContainer" + id + "' class='achievement'><div class='row'><center><label>Achievement Unlocked!</label></center><div id='achievementImg' style='margin:auto;'><img class='img-responsive' src='" + ot.$table.data('imagesurl') + "/" + imgName + "'/></div><div id='achievementLbl1'><center>" + message.UserAchievements[a].Header + "</center></div><div id='achievementLbl2'><center>" + message.UserAchievements[a].Description + ': ' + message.UserAchievements[a].Value + "</center></div></div></div>")

             $('#achievementContainer' + id).delay(time).fadeIn(1500).fadeOut(1500);
             time = time + 3000;
             id = id + 1;
         }

         //alert(message.UserAchievement.Description + ' ' + message.UserAchievement.Level);
     },

     GetOut: function (message) {
         window.location = ot.$table.data('urlcreate');
     },

     Logout: function (message) {
         window.location = ot.$bodypage.data('urllogoff');
     },

     GoToTournamentHall: function (message) {
         window.location = ot.$bodypage.data('tournament') + '/' + message.TournamentId;
     },

     Chat: function (message) {
         if (message.User.Username === "System") {

             var messageArray = message.Text.replace(/</g, '&lt;').replace(/>/g, '&gt;').split(' ');

             for (var i in messageArray) {
                 if (messageArray[i].toString().toLowerCase() == "player") {
                     messageArray[i] = "user "
                 }
                 else if (messageArray[i].toString().toLowerCase() == "can_not_use_chat_for") {
                     messageArray[i] = "can't use chat for "
                 }
                 else if (messageArray[i].toString().toLowerCase() == "minutes") {
                     messageArray[i] = " minutes!"
                 }
             }

             message.Text = messageArray.join(' ');
             messageArray = message.Text.replace(/</g, '&lt;').replace(/>/g, '&gt;').split(' ');

             for (var i in messageArray) {

                 if (messageArray[i] == "folds") {

                     if (ot.playerPositions.SouthPlayer.Position == messageArray[0]) {
                         ot.$southPlayerName.removeClass('highlightgreen').addClass('highlightred');
                         ot.$gameLog.append('<strong style="color: red;">' + ot.playerPositions.SouthPlayer.Username + ' ' + ot.$gameLog.data('folds') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                         setTimeout(function () {
                             ot.$southPlayerName.removeClass('highlightred');
                         }, 1500);
                     }
                     if (ot.playerPositions.NorthPlayer.Position == messageArray[0]) {
                         ot.$northPlayerName.removeClass('highlightgreen').addClass('highlightred');
                         ot.$gameLog.append('<strong style="color: red;">' + ot.playerPositions.NorthPlayer.Username + ' ' + ot.$gameLog.data('folds') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                         setTimeout(function () {
                             ot.$northPlayerName.removeClass('highlightred');
                         }, 1500);
                     }
                     if (ot.playerPositions.EastPlayer.Position == messageArray[0]) {
                         ot.$eastPlayerName.removeClass('highlightgreen').addClass('highlightred');
                         ot.$gameLog.append('<strong style="color: red;">' + ot.playerPositions.EastPlayer.Username + ' ' + ot.$gameLog.data('folds') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                         setTimeout(function () {
                             ot.$eastPlayerName.removeClass('highlightred');
                         }, 1500);
                     }
                     if (ot.playerPositions.WestPlayer.Position == messageArray[0]) {
                         ot.$westPlayerName.removeClass('highlightgreen').addClass('highlightred');
                         ot.$gameLog.append('<strong style="color: red;">' + ot.playerPositions.WestPlayer.Username + ' ' + ot.$gameLog.data('folds') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                         setTimeout(function () {
                             ot.$westPlayerName.removeClass('highlightred');
                         }, 1500);
                     }

                     $('#foldSound')[0].play();

                     return false;

                 }
                 if (messageArray[i] == "dogs") {
                     if (ot.playerPositions.SouthPlayer.Position == messageArray[0]) {
                         ot.$gameLog.append('<strong style="color: blue;">' + ot.playerPositions.SouthPlayer.Username + ' ' + ot.$gameLog.data('playeddogs') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                         ot.$dogPlayer.text(ot.playerPositions.SouthPlayer.Username);
                     }
                     if (ot.playerPositions.NorthPlayer.Position == messageArray[0]) {
                         ot.$gameLog.append('<strong style="color: blue;">' + ot.playerPositions.NorthPlayer.Username + ' ' + ot.$gameLog.data('playeddogs') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                         ot.$dogPlayer.text(ot.playerPositions.NorthPlayer.Username);
                     }
                     if (ot.playerPositions.EastPlayer.Position == messageArray[0]) {
                         ot.$gameLog.append('<strong style="color: blue;">' + ot.playerPositions.EastPlayer.Username + ' ' + ot.$gameLog.data('playeddogs') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                         ot.$dogPlayer.text(ot.playerPositions.EastPlayer.Username);
                     }
                     if (ot.playerPositions.WestPlayer.Position == messageArray[0]) {
                         ot.$gameLog.append('<strong style="color: blue;">' + ot.playerPositions.WestPlayer.Username + ' ' + ot.$gameLog.data('playeddogs') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                         ot.$dogPlayer.text(ot.playerPositions.WestPlayer.Username);
                     }
                     $('#dogSound')[0].play();
                     ot.$dog.fadeIn(2000).fadeOut(2000);
                     return false;
                 }

                 if (messageArray[i] == "TAKES_THE_DRAGON") {
                     ot.$gameLog.append('<strong style="color: orange;">' + message.Text.replace("TAKES_THE_DRAGON", ot.$gameLog.data('takesthedragon')) + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (messageArray[i] == "VOTES_TO_KICK:") {
                     ot.$gameLog.append('<strong style="color: red;">' + message.Text.replace("VOTES_TO_KICK:", ot.$gameLog.data('votestokick')) + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (~messageArray[i].indexOf("WAITING_1_MINUTE_FOR")) {
                     ot.$gameLog.append('<strong style="color: brown;">' + message.Text.replace("WAITING_1_MINUTE_FOR", ot.$gameLog.data('waitone') + ' ') + ' ' + ot.$gameLog.data('toreconnect') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (messageArray[i] == "REJOINS") {
                     ot.$gameLog.append('<strong style="color: green;">' + message.Text.replace("REJOINS", ot.$gameLog.data('rejoins')) + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (messageArray[i] == "LEFT_TABLE") {
                     ot.$gameLog.append('<strong style="color: blue;">' + message.Text.replace("LEFT_TABLE", ot.$gameLog.data('lefttable')) + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (messageArray[i] == "START_NEW_GAME") {
                     ot.$gameLog.append('<strong style="color: brown;">' + message.Text.replace("START_NEW_GAME", ot.$gameLog.data('startnewgame')) + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (messageArray[i] == "WIN_THE_TABLE") {
                     ot.$gameLog.append('<strong style="color: blue;">' + (message.Text.replace("WIN_THE_TABLE", ot.$gameLog.data('win'))).replace("AND", ot.$gameLog.data('and')) + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (messageArray[i] == "DIDNT_COME_BACK") {
                     ot.$gameLog.append('<strong style="color: blue;">' + message.Text.replace("DIDNT_COME_BACK", ot.$gameLog.data('didntcomeback')) + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (messageArray[i] == "PUNISHED_SLOW") {
                     ot.$gameLog.append('<strong style="color: red;">' + message.Text.replace("PUNISHED_SLOW", ot.$gameLog.data('punishedslow')) + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (messageArray[i] == "STARTED!") {
                     ot.$gameLog.append('<strong style="color: brown;">' + ot.$gameLog.data('newroundstarted') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (messageArray[i] == "TAKES_THE_STACK") {
                     ot.$gameLog.append('<strong style="color: brown;">' + message.Text.replace("TAKES_THE_STACK", ot.$gameLog.data('takesthestack')) + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (messageArray[i] == "STARTS") {
                     ot.$gameLog.append('<strong style="color: green;">' + message.Text.replace("STARTS", ot.$gameLog.data('pressedstart')) + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if (messageArray[i] == "EXCHANGES") {
                     ot.$gameLog.append('<strong style="color: black;">' + message.Text.replace("EXCHANGES", ot.$gameLog.data('exchanges')) + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     return false;
                 }

                 if ((messageArray[i] == "CALLS") && (messageArray[parseInt(i, 10) + 1] == "GRAND")) {
                     var tichuText = message.Text.replace("CALLS GRAND TICHU", ot.$gameLog.data('callsgrand'));
                     ot.$gameLog.append('<strong style="color: blue;">' + tichuText + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     $('#gongSound')[0].play();
                     $('#tichuContainerMessage').html(tichuText);
                     $('#tichuContainer').fadeIn(500).fadeOut(500);
                     return false;
                 }

                 if ((messageArray[i] == "CALLS") && (messageArray[parseInt(i, 10) + 1] == "TICHU")) {
                     var tichuText = message.Text.replace("CALLS TICHU", ot.$gameLog.data('callstichu'));
                     ot.$gameLog.append('<strong style="color: blue;">' + tichuText + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
                     $('#gongSound')[0].play();
                     $('#tichuContainerMessage').html(tichuText);
                     $('#tichuContainer').fadeIn(500).fadeOut(500);
                     return false;
                 }

                 //BOMB_PLAYED
                 if (messageArray[i] == "BOMB_PLAYED") {
                     $('#bombSound')[0].play();
                     $('#boomContainer').removeClass().addClass("boomContainer" + Math.floor((Math.random() * 6) + 1)).fadeIn(2000).fadeOut(2000);
                     return false;
                 }

                 if (messageArray[i] == "YOU_CAN_NOT_USE_CHAT_NOW") {

                     message.Text = "You can't use chat now, try later.";
                 }
             }
             ot.$gameLog.append('<strong style="color: black;">' + message.Text + '<strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
         }
         else {
             if (message.Text.toString() != '') {
                 var messageArray = message.Text.replace(/</g, '&lt;').replace(/>/g, '&gt;').split(' ');

                 for (var i in messageArray) {
                     if (messageArray[i].substring(0, 7) === "http://" || messageArray[i].substring(0, 8) === "https://") {
                         messageArray[i] = '<a target="_blank" href="' + messageArray[i] + '">' + messageArray[i] + '</a>';
                     }
                 }

                 message.Text = messageArray.join(' ');

                 htmlMessage = '<strong><a href="' + ot.$globalOnlineUsersContainer.data('url') + message.User.Username + '" style="color: ' + message.User.ColorHex + ';"><b>' + message.User.Username + '</b></a>: </strong>' + message.Text + '<br>';

                 $('#chatSound')[0].play();

                 ot.$chatbox.append(htmlMessage).scrollTop(ot.$chatbox[0].scrollHeight);
             }
         }
     },

     GlobalChat: function (message) {
         if ($('#globalchat').length) {
             var messageArray = message.Text.replace(/</g, '&lt;').replace(/>/g, '&gt;').split(' ');

             for (var i in messageArray) {
                 if (messageArray[i].substring(0, 7) === "http://" || messageArray[i].substring(0, 8) === "https://") {
                     messageArray[i] = '<a target="_blank" href="' + messageArray[i] + '">' + messageArray[i] + '</a>';
                 }
             }

             message.Text = messageArray.join(' ');

             var htmlMessage = '<strong><a href="' + ot.$globalOnlineUsersContainer.data('url') + message.User.Username + '" style="color: ' + message.User.ColorHex + ';"><b>' + message.User.Username + '</b></a>: </strong>' + message.Text + '<br>';

             switch (message.User.Username) {
                 case "System":
                     var messageArray = message.Text.replace(/</g, '&lt;').replace(/>/g, '&gt;').split(' ');
                     for (var i in messageArray) {
                         if (messageArray[i].toString().toLowerCase() == "player") {
                             messageArray[i] = "user "
                         }
                         else if (messageArray[i].toString().toLowerCase() == "can_not_use_chat_for") {
                             messageArray[i] = "can't use chat for "
                         }
                         else if (messageArray[i].toString().toLowerCase() == "minutes") {
                             messageArray[i] = " minutes!"
                         }
                     }
                     message.Text = messageArray.join(' ');
                     if (message.Text.toString().toLowerCase() == "you_can_not_use_chat_now") {
                         message.Text = "You can't use chat now, try later.";
                     }
                     htmlMessage = '<strong style="color: red;">System: </strong><strong style="color: black;">' + message.Text + '</strong><br>';
                     break;
             }

             if (message.PrivateMessageFrom == true) {
                 htmlMessage = '<strong>PM from </strong>' + htmlMessage;
             }
             else if (message.PrivateMessageTo == true) {
                 htmlMessage = '<strong>PM to </strong>' + htmlMessage;
             }

             ot.$globalChatBox.append(htmlMessage).scrollTop(ot.$globalChatBox[0].scrollHeight);

             if (sessionStorage.chat == undefined) {
                 sessionStorage.chat = '';
             }

             sessionStorage.chat += htmlMessage;
         }
     },

     Error: function (message) {

         if (message.Text === 'ERROR') {
             window.location = ot.$bodypage.data('home');
         }

         if (message.Text === 'PLAYER_DONT_PLAY') {
             $('#playernotavailable').fadeIn(1000).fadeOut(1000);
         }

         if (message.Text === 'WRONG_PASSWORD') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('password'));
             ot.HorizontalAlign(ot.$loadingMessage);
             ot.HorizontalAlign(ot.$ingamePassword);
             ot.$ingamePassword.show().keydown(function (e) {
                 if (e.which == 13) {
                     e.preventDefault();
                     window.location = ot.$bodypage.data('table') + '/' + ot.$table.data('servername') + '/' + ot.$table.data('tableid') + '/' + $('#ingamePassword').val();
                 }
             });
         }

         if (message.Text === 'TOO_EARLY_FOR_THIS_TOURNAMENT') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('tooearly'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$bodypage.data('home');
             }, 3000);
         }

         if (message.Text === 'CAN_NOT_ENTER_TABLE') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('cannotenter'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text === 'NOT_ENOUGH_COINS') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('notenoughcoins'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text === 'YOU_MUST_BE_GOLD_MEMBER') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('goldmember'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text === 'YOU_MUST_HAVE_MORE_THAN_500') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('morethan500'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text === 'TABLE_FULL_YOU_MUST_BE_GOLD_MEMBER') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('tablefullgoldmember'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text === 'YOUR_RATING_IS_TOO_LOW_TO_ENTER') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('lowrating'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text === 'YOUR_RATING_IS_TOO_HIGH_TO_ENTER') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('highrating'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text === 'YOUR_LEVEL_IS_TOO_LOW_TO_ENTER') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('lowlevel'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text === 'YOUR_LEVEL_IS_TOO_HIGH_TO_ENTER') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('highlevel'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text === 'YOU_HAVE_BEEN_KICKED') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('beenkicked'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text === 'NOT_ALLOWED_ENTER_TABLE') {
             ot.$loadingMessage.text(ot.$loadingMessage.data('notallowed'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text == "NAME_NOT_ACCEPTED") {
             ot.$loadingMessage.text(ot.$loadingMessage.data('namenotaccepted'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text == "TABLE_NAME_EXISTS") {
             ot.$loadingMessage.text(ot.$loadingMessage.data('tablenameexists'));
             ot.HorizontalAlign(ot.$loadingMessage);
             setTimeout(function () {
                 window.location = ot.$table.data('urlcreate');
             }, 3000);
         }

         if (message.Text === 'YOU_CAN_NOT_PLAY_FOLD') {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('cannotfold') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text === 'YOU_MUST_PLAY_ASKED_CARD') {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('mustplayasked') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text === 'YOU_CAN_NOT_BEAT_TABLE') {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('cantbeattable') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text === 'CANNOT_CHANGE_POSITION') {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('cannotchangeposition') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text === 'PLAYER_NOT_EXISTS') {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('playernotexists') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text === 'NOT_YOUR_TURN') {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('notyourturn') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text === 'NOT_VALID_CARDS') {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('youcannot') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text === 'YOU_DONT_HAVE_CARDS') {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('selectcardsfirst') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text === 'ONLY_MODERATORS_CAN_CHAT_AS_SPECTATORS') {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('onlymodschat') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text === 'YOU_ARE_MUTED') {
             ot.$gameLog.append('<strong style="color: orange;">' + ot.$gameLog.data('youaremuted') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text === 'PLEASE_SEND_THREE_CARDS') {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('selectcardsfirst') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text === 'PLEASE_REPEAT_YOUR_ACTION') {
             ot.$gameLog.append('<strong style="color: blueviolet;">' + ot.$gameLog.data('repeataction') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text == "YOU_DONT_HAVE_BOMB") {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('youdonthavebomb') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text == "CAN_NOT_SAY_GRAND_TICHU") {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('cannotsaygrandtichu') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         if (message.Text == "CAN_NOT_SAY_TICHU") {
             ot.$gameLog.append('<strong style="color: red;">' + ot.$gameLog.data('cannotsaytichu') + '</strong><br>').scrollTop(ot.$gameLog[0].scrollHeight);
             return false;
         }

         ot.$gameLog.append(message.Text + '<br>').scrollTop(ot.$gameLog[0].scrollHeight);
     },

     ChatUsers: function (message, fromStore) {

         if (fromStore == undefined || fromStore == false) {
             localStorage.setItem('onlineusers', JSON.stringify(message));
         }

         var users = message.ChatUsers;

         var userFriends = ot.$UserFriends.val().split(';');
         var userFriends = userFriends.filter(function (friend) {
             return friend != null && friend != '' && friend != ' ';
         })

         var me = ot.$Username.val();
         var image = ot.$Image.val();
         var roleID = ot.$RoleID.val();
         var colorHex = ot.$ColorHex.val();
         var isCheater = ot.$IsCheater.val();

         ot.$globalOnlineUsersMe.html('');
         ot.$globalOnlineUsersFriends.html('');
         ot.$globalOnlineUsersMods.html('');
         ot.$globalOnlineUsersOthers.html('');

         if (me != null) {
             if (roleID === "3" || roleID === "4" || roleID === "5") {
                 if (isCheater === "True") {
                     ot.$globalOnlineUsersMe.append('<span style="white-space:nowrap;"><img border="0" src="' + ot.$globalOnlineUsersContainer.data('cheatericon') + '" alt="" style="position:absolute;width:20px;height:20px" /><img src="https://www.gravatar.com/avatar/' + image + '?s=32&d=identicon&r=PG" height="20" width="20" alt="" /><a href="' + ot.$globalOnlineUsersContainer.data('url') + me + '"style="color: ' + colorHex + ';"><b>' + ' ' + me + '</b></a></span><br>');
                 }
                 else {
                     ot.$globalOnlineUsersMe.append('<span style="white-space:nowrap;"><img src="https://www.gravatar.com/avatar/' + image + '?s=32&d=identicon&r=PG" height="20" width="20" alt="" /><a href="' + ot.$globalOnlineUsersContainer.data('url') + me + '"style="color: ' + colorHex + ';"><b>' + ' ' + me + '</b></a></span><br>');
                 }
             }
         }

         for (var i in users) {
             if (userFriends.indexOf(users[i].Username) > -1 && (users[i].RoleID === 3 || users[i].RoleID === 4 || users[i].RoleID === 5)) {
                 if (users[i].IsCheater) {
                     ot.$globalOnlineUsersFriends.append('<span style="white-space:nowrap;"><img border="0" src="' + ot.$globalOnlineUsersContainer.data('cheatericon') + '" alt="" style="position:absolute;width:20px;height:20px" /><img src="https://www.gravatar.com/avatar/' + users[i].Image + '?s=32&d=identicon&r=PG" height="20" width="20" alt="" /><a href="' + ot.$globalOnlineUsersContainer.data('url') + users[i].Username + '"style="color: ' + users[i].ColorHex + ';"><b>' + ' ' + users[i].Username + '</b></a></span><br>');
                 }
                 else {
                     ot.$globalOnlineUsersFriends.append('<span style="white-space:nowrap;"><img src="https://www.gravatar.com/avatar/' + users[i].Image + '?s=32&d=identicon&r=PG" height="20" width="20" alt="" /><a href="' + ot.$globalOnlineUsersContainer.data('url') + users[i].Username + '"style="color: ' + users[i].ColorHex + ';"><b>' + ' ' + users[i].Username + '</b></a></span><br>');
                 }
             }
         }

         for (var i in users) {
             if (users[i].RoleID === 1 || users[i].RoleID === 2) {
                 if (users[i].IsCheater) {
                     ot.$globalOnlineUsersMods.append('<span style="white-space:nowrap;"><img border="0" src="' + ot.$globalOnlineUsersContainer.data('cheatericon') + '" alt="" style="position:absolute;width:20px;height:20px" /><img src="https://www.gravatar.com/avatar/' + users[i].Image + '?s=32&d=identicon&r=PG" height="20" width="20" alt="" /><a href="' + ot.$globalOnlineUsersContainer.data('url') + users[i].Username + '"style="color: ' + users[i].ColorHex + ';"><b>' + ' ' + users[i].Username + '</b></a></span><br>');
                 }
                 else {
                     ot.$globalOnlineUsersMods.append('<span style="white-space:nowrap;"><img src="https://www.gravatar.com/avatar/' + users[i].Image + '?s=32&d=identicon&r=PG" height="20" width="20" alt="" /><a href="' + ot.$globalOnlineUsersContainer.data('url') + users[i].Username + '"style="color: ' + users[i].ColorHex + ';"><b>' + ' ' + users[i].Username + '</b></a></span><br>');
                 }
             }
         }

         for (var i in users) {
             if (userFriends.indexOf(users[i].Username) < 0 && users[i].Username != me && (users[i].RoleID === 3 || users[i].RoleID === 4 || users[i].RoleID === 5)) {
                 if (users[i].IsCheater) {
                     ot.$globalOnlineUsersOthers.append('<span style="white-space:nowrap;"><img border="0" src="' + ot.$globalOnlineUsersContainer.data('cheatericon') + '" alt="" style="position:absolute;width:20px;height:20px" /><img src="https://www.gravatar.com/avatar/' + users[i].Image + '?s=32&d=identicon&r=PG" height="20" width="20" alt="" /><a href="' + ot.$globalOnlineUsersContainer.data('url') + users[i].Username + '"style="color: ' + users[i].ColorHex + ';"><b>' + ' ' + users[i].Username + '</b></a></span><br>');
                 }
                 else {
                     ot.$globalOnlineUsersOthers.append('<span style="white-space:nowrap;"><img src="https://www.gravatar.com/avatar/' + users[i].Image + '?s=32&d=identicon&r=PG" height="20" width="20" alt="" /><a href="' + ot.$globalOnlineUsersContainer.data('url') + users[i].Username + '"style="color: ' + users[i].ColorHex + ';"><b>' + ' ' + users[i].Username + '</b></a></span><br>');
                 }
             }
         }

         if (fromStore == undefined || fromStore == false) {
             ot.$onlineUsersCount.text(' - ' + users.length);
         }
     },
 },

 //Alignment engines.
 HorizontalAlign: function (selector) {
     selector.css('left', (selector.parent().width() / 2) - (selector.width() / 2) + 'px');
 },

 VerticalAlign: function (selector) {
     selector.css('top', (selector.parent().height() / 2) - (selector.height() / 2) + 'px');
 },

 //TitleAlert.
 TitleAlert: function (msg) {
     var oldTitle = document.title;
     var timeoutId = setInterval(function () {
         document.title = document.title == msg ? ' ' : msg;
     }, 1000);
     $(window).mousemove(function () {
         clearInterval(timeoutId);
         document.title = oldTitle;
         $(window).off('mousemove');
     });
 },

 //Required properties to hold west and east players positions.
 westPlayer: null,
 eastPlayer: null,

 spamCount: 0,
 spamTrigger: false,

 chosenCards: '',

 AutoFold: true,

 playerPositions: null,

 //Required property to start and stop socket reconnection attempts.
 reconnectTimeout: null,

 //Required property to hold current active socket.
 //socket: null,

 //Socket wrapper for sending messages. Stringifies JSON objects.
 //SendMessage: function (socket, message) {
 //    socket.send(JSON.stringify(message));
 //},

 SendWorldHubMessage: function (message) {
     ot.worldHub.invoke('send', JSON.stringify(message));
     //ot.worldHub.server.send(JSON.stringify(message));
 },

 SendTableHubMessage: function (message) {
     ot.tableHub.invoke('send', JSON.stringify(message));
     //ot.worldHub.server.send(JSON.stringify(message));
 }
    }

    //Expose the "OnlineTichu" object to the DOM as "ot" if an "ot" object does not already exists.
    if (!window.ot) {
        window.ot = OnlineTichu;
    }

    //Initialize.
    ot.HorizontalAlign(ot.$startTable);
    ot.VerticalAlign(ot.$startTable);
    ot.$startTable.hide();
    ot.$nextCards.hide();
    ot.$callGrandTichu.hide();
    ot.$exchangeCards.hide();
    ot.$exchangedCards.hide();
    ot.$callTichu.hide();
    ot.$askCards.hide();
    ot.$phoenixCards.hide();
    ot.HorizontalAlign(ot.$loadingMessage);
    ot.$ingamePassword.hide();
    ot.$dog.hide();
    ot.HorizontalAlign(ot.$dog);
    ot.HorizontalAlign(ot.$askCards);
    ot.HorizontalAlign(ot.$phoenixCards);
    $('.playerMenu').hide();
    $('#tichuContainer').hide();
    $('#boomContainer').hide();
    //$('#achievementContainer').hide();
    $('#playernotavailable').hide();

    if (ot.$globalChatBox.length > 0) {
        ot.$globalChatBox.append(sessionStorage.chat).scrollTop(ot.$globalChatBox[0].scrollHeight);
    }

    sessionStorage.chathidden = true;
    sessionStorage.onlineusers = true;

    if ($('#onlineusers').length) {
        var usersMessage = localStorage.getItem('onlineusers');
        if (usersMessage != undefined && usersMessage.length) {
            ot.reaction.ChatUsers(JSON.parse(usersMessage), true);
        }
    }

    //Events.
    ot.$globalChatMessage.keypress(function (e) {
        if (e.which == 13) {
            ot.action.GlobalChat();
        }
    });

    ot.$clearChat.click(function () {
        ot.$chatbox.html('');
    });

    ot.$globalClearChat.click(function () {
        ot.$globalChatBox.html('');
        sessionStorage.chat = '';
    });

    ot.$nextCards.hide().click(function () {
        ot.action.NextCards();
        $(this).hide();
        ot.$callGrandTichu.hide();
    });

    ot.$startTable.hide().click(function () {
        ot.action.StartTable();
        $(this).hide();
    });

    ot.$callGrandTichu.hide().click(function () {
        ot.action.CallGrandTichu();
        $(this).hide();
        ot.$nextCards.hide();
    });

    ot.$callTichu.hide().click(function () {
        ot.action.CallTichu();
        $(this).hide();
    });

    ot.$exchangeCards.hide().click(function () {
        ot.action.ExchangeCards();
    });
    ot._exchangeCard.hide();

    ot.$chatMessage.keypress(function (e) {
        if (e.which == 13) {
            ot.action.Chat();
        }
    });

    ot.$playTurn.hide().click(function () {
        ot.action.PlayTurn();
        ot.chosenCards = '';
    });

    ot.$fold.hide().click(function () {
        ot.action.Fold();
        $(this).hide();
    });

    ot.$startReview.click(function () {
        ot.action.StartReview();
    });

    ot.$nextExchange.click(function () {
        ot.action.StartReview();
    });

    ot.$voteFair.click(function () {
        ot.action.VoteFair();
        ot.$voteFair.hide();
        ot.$voteCheat.hide();
    });

    ot.$voteCheat.click(function () {
        ot.action.VoteCheat();
        ot.$voteCheat.hide();
        ot.$voteFair.hide();
    });

    ot._askCards.click(function () {
        ot._askCards.removeClass('active');
        $(this).addClass('active');
    });

    ot._phoenixCards.click(function () {
        ot.action.PlayTurn($(this).attr('id').split('_')[1]);
    });

    $('.avTableBox').delegate('.availableTable', "click", (function () {
        window.location = ot.$bodypage.data('table') + '/' + $(this).attr('id').split('_')[1] + '/' + $(this).attr('id').split('_')[2];
    }));

    ot.$globalChatMore.click(function () {
        if (ot.$globalChatEmoticons[0].style.display == "none") {
            ot.$globalChatEmoticons[0].style.display = "inline";
        }
        else {
            ot.$globalChatEmoticons[0].style.display = "none";
        }
    });

    ot.$scores.mouseenter(function () {
        ot.$scoreDetails[0].style.visibility = "visible";
    });

    ot.$scores.mouseleave(function () {
        ot.$scoreDetails[0].style.visibility = "hidden";
    });

    ot.$scoreDetails.mouseenter(function () {
        ot.$scoreDetails[0].style.visibility = "visible";
    });

    ot.$scoreDetails.mouseleave(function () {
        ot.$scoreDetails[0].style.visibility = "hidden";
    });

    ot.$spectators.mouseenter(function () {
        ot.$spectatorsDetails[0].style.visibility = "visible";
    });

    ot.$spectators.mouseleave(function () {
        ot.$spectatorsDetails[0].style.visibility = "hidden";
    });

    ot.$spectatorsDetails.mouseenter(function () {
        ot.$spectatorsDetails[0].style.visibility = "visible";
    });

    ot.$spectatorsDetails.mouseleave(function () {
        ot.$spectatorsDetails[0].style.visibility = "hidden";
    });

    ot.$playBomb.mouseenter(function () {
        ot.$bombs[0].style.visibility = "visible";
    });

    ot.$playBomb.mouseleave(function () {
        ot.$bombs[0].style.visibility = "hidden";
    });

    ot.$bombs.mouseenter(function () {
        ot.$bombs[0].style.visibility = "visible";
    });

    ot.$bombs.mouseleave(function () {
        ot.$bombs[0].style.visibility = "hidden";
    });

    //var bombsContainer = document.getElementById('bombs');  // Parent
    //console.log(bombsContainer);
    //console.log(ot.$bombs[0]);

    try {
        ot.$bombs[0].addEventListener('click', function (e) {
            var bombid = null;
            if (e.target.tagName === 'LI') {
                bombid = $(e.target).parent()[0].id;
                //console.log(1);
            }
            else if (e.target.tagName === 'UL') {
                bombid = e.target.id;  // Check if the element is a LI
                //console.log(2);
            }

            //console.log(Number(bombid.split("_")[1]));

            if (bombid != null) {
                ot.action.PlayBomb(Number(bombid.split("_")[1]));
                ot.chosenCards = '';
            }
        });
    }
    catch (e) {
        //console.log(e);
    }
    //ot.$bombs.on('click', function () {
    //console.log($(this));
    //if ($(this).hasClass('chosenCard')) {
    //    $(this).removeClass('chosenCard');
    //    chosenCard = null;
    //} else {
    //    $('.chosenCard').removeClass('chosenCard');
    //    $(this).addClass('chosenCard');
    //    chosenCard = $(this);
    //}
    //});

    ot.$autoFold.click(function () {
        ot.AutoFold = !ot.AutoFold;

        if (ot.AutoFold) {
            ot.$autoFoldValue.text(ot.$autoFoldValue.data('on'));
        } else {
            ot.$autoFoldValue.text(ot.$autoFoldValue.data('off'));
        }
    });

    ot.$voteRestart.click(function () {
        ot.action.VoteRestart();
    });

    ot.$muteSound.click(function () {
        $('#readySound')[0].muted = (!$('#readySound')[0].muted);
        $('#playSound')[0].muted = (!$('#playSound')[0].muted);
        $('#foldSound')[0].muted = (!$('#foldSound')[0].muted);
        $('#dogSound')[0].muted = (!$('#dogSound')[0].muted);
        $('#chatSound')[0].muted = (!$('#chatSound')[0].muted);
        $('#gongSound')[0].muted = (!$('#gongSound')[0].muted);
        $('#bombSound')[0].muted = (!$('#bombSound')[0].muted);

        if ($('#readySound')[0].muted) {
            ot.$muteSound.removeClass('btn-success').addClass('btn-danger');
            ot.$muteSound.children().removeClass('icon-volume-up').addClass('icon-volume-off');
        } else {
            ot.$muteSound.removeClass('btn-danger').addClass('btn-success');
            ot.$muteSound.children().removeClass('icon-volume-off').addClass('icon-volume-up'); s
        }
    });

    function UpdateSpectators(table, isSpec) {
        ot.$spectators.innerHTML = "";
        ot.$spectators.html('Spectators: ' + (isNaN(table.Spectators.length) ? 0 : table.Spectators.length));

        ot.$spectatorsDetails.innerHTML = "";


        if (isSpec) {
            var displaySpectatorsHtmlString = "";

            $(table.Spectators).each(function () {
                //console.log(this.RoleID);
                //ot.$spectatorsDetails.html(this.Username);
                displaySpectatorsHtmlString += '<h5 style="color: ' + this.ColorHex + '; margin-bottom:-25px;"><b>' + this.Username.substring(0, 10) + '</b></h5><br>';
            });

            ot.$spectatorsDetails.html(displaySpectatorsHtmlString);
        }
        else {
            ot.$spectatorsDetails.html('<table id="spectatorsDetailsTable"><tr><th style="text-align: center;width: 140px;"></th><th style="text-align: center;"></th></tr></table>');

            $(table.Spectators).each(function () {
                //console.log(this.RoleID);
                //ot.$spectatorsDetails.html(this.Username);
                if (this.RoleID === 1 || this.RoleID === 2) {
                    $('#spectatorsDetailsTable').append('<tr><td><h5 style="color: ' + this.ColorHex + ';"><b>' + this.Username.substring(0, 10) + '</b></h5></td><td></td></tr>');
                }
                else {
                    if (this.isMuted) {
                        $('#spectatorsDetailsTable').append('<tr><td><h5 style="color: ' + this.ColorHex + ';"><b>' + this.Username.substring(0, 10) + '</b></h5></td><td><span class="glyphicon glyphicon-volume-off"></span></td></tr>');
                    }
                    else {
                        $('#spectatorsDetailsTable').append('<tr><td><h5 style="color: ' + this.ColorHex + ';"><b>' + this.Username.substring(0, 10) + '</b></h5></td><td><span  id="muteSpec_' + this.Username + '" class="glyphicon glyphicon-volume-up"></span></td></tr>');
                    }
                }
            });
        }
    };

    try {
        ot.$spectatorsDetails[0].addEventListener('click', function (e) {
            //console.log(e.target.tagName)

            var muteSpecid = null;
            if (e.target.tagName === 'SPAN') {
                muteSpecid = $(e.target)[0].id;
                ot.action.MuteSpectator(muteSpecid.split("Spec_")[1]);
            }
        });
    }
    catch (e) {
        //console.log(e);
    }
})();
