import sys
import time, datetime
import re, requests, json
import asyncio
import telepot
from telepot.aio.loop import MessageLoop
from telepot.aio.delegate import per_chat_id, create_open, pave_event_space, include_callback_query_chat_id
from telepot.namedtuple import InlineQueryResultArticle, InputTextMessageContent
from telepot.namedtuple import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove, KeyboardButton


BOT_BTC = 'BTC查詢'
ALTCOIN_QUERY = 'Altcoin查詢'
BANKTW_QUERY = '台銀匯率查詢'
POLONIEX_QUERY = 'P網查詢'
BOT_MINE = '挖礦收益'
ETH_WALLET = 'ETH錢包紀錄查詢'
MC_MINE = 'MC礦工查看'
HELP = 'HELP'

class User:
    def __init__(self, chatid):        
        self.chat_id = chatid

        self.eth_wallet_state = False
        self.eth_wallet_subsribe_state = False   
        self.eth_wallet_subsribe = False  

        self.mc_mine_state = False
        self.mc_mine_subsribe_state = False
        self.mc_mine_subsribe = False

        self.mining_profit_state = False
        self.bot_btc_state = False
        self.help_state = False
        self.altcoin_state = False
        self.bankofTW_state = False
        self.poloniex_state = False
        self.general_state = True


    def getState(self, msg):
        if(self.eth_wallet_subsribe_state or self.mc_mine_subsribe_state):
            return
        # state   
        if(msg == ETH_WALLET or msg.lower() == 'eth wallet' ):            
            
            self.freeAllStates(0)
            self.eth_wallet_state = True
            # self.general_state = False
            return
        if(msg == MC_MINE or msg.lower() == 'mc mine'):            
                
            self.freeAllStates(0)
            self.mc_mine_state = True
            # self.general_state = False
            return                   
        
        if(msg == ALTCOIN_QUERY):
            self.freeAllStates(0)
            self.altcoin_state = True
            # self.general_state = False
            return
        if(msg == BANKTW_QUERY):
            self.freeAllStates(0)
            self.bankofTW_state = True
            # self.general_state = False
            return
        if(msg == POLONIEX_QUERY):
            self.freeAllStates(0)
            self.poloniex_state = True
            # self.general_state = Falseself.freeAllStates(0)
            return
        if( msg == HELP or ('help' in msg.lower())):
            self.freeAllStates(0)
            self.help_state = True
            # self.general_state = False
            return
        if(msg == BOT_BTC or msg.lower() == 'bot btc'):
            self.freeAllStates(0)
            self.bot_btc_state = True
            # self.general_state = False
            return
        if(msg == BOT_MINE or msg.lower() == 'bot mine'):
            self.freeAllStates(0)
            self.mining_profit_state = True
            # self.general_state = False
            return
        self.freeAllStates(1)
            

    def freeAllStates(self, flag):
        # free all states
        for attr, value in self.__dict__.items():
            if(attr is ('eth_wallet_subsribe') or attr is 'mc_mine_subsribe'):
                continue
            if(attr is not ('chat_id')):
                setattr(self, attr, False)   
        # if 1, set general state to true    
        if(flag):
            self.general_state = True

def getUser(chat_id):
    for user in users:
        if user.chat_id == chat_id:
            return user
    return None

def isValidEthAddress(addr):
    if(len(addr) != 42):
        return False
    if(addr[0:2] != '0x'):
        return False
    if(re.match("^[A-Za-z0-9]*$", addr)):
        return True
    else:
        return False


users = [] 
userstate = None  
ALTCOINS = ['ETH','EXP', 'ETC', 'XMR', 'ZEC', 'MC', 'LTC', 'XRP']
TWBCOINS = ['USD','CNY', 'HKD','JPY', 'GBP', 'AUD', 'CAD' , 'SGD', 'CHF', 'ZAR', 'SEK', 'NZD', 'THB', 'PHP', 'IDR', 'EUR', 'KRW', 'VND', 'MYR']
service_keyboard = ReplyKeyboardMarkup(
                            keyboard=[
                                [KeyboardButton(text=BOT_BTC),KeyboardButton(text=ALTCOIN_QUERY)], 
                                [KeyboardButton(text=BANKTW_QUERY),KeyboardButton(text=POLONIEX_QUERY)],
                                [KeyboardButton(text=BOT_MINE),KeyboardButton(text=ETH_WALLET)],
                                [KeyboardButton(text=MC_MINE),KeyboardButton(text=HELP)],
                            ]
                        )  

class GPUMiningBot(telepot.aio.helper.ChatHandler):

    def __init__(self, *args, **kwargs):
        super(GPUMiningBot, self).__init__(*args, **kwargs)

    async def on_chat_message(self, msg):      
        # two lines of keyboard
        keyboard1 = []                         
        keyboard2 = []   
        
        content_type, chat_type, chat_id = telepot.glance(msg)
        if(getUser(chat_id) is None):
            print("new user", chat_id)
            user = User(chat_id)
            users.append(user)


        user = getUser(chat_id)
        msg = msg['text']
        print(chat_id, msg) 
        await self._cancel_last()
        user.getState(msg)      
       
        
        # # # # # # # # # # # # # # # #
        #        FIXED QUERY         #
        # # # # # # # # # # # # # # # 
        
        # help
        if(user.help_state):            
            reply = callAPI('help', {'usersay': msg, 'channel': 'tg', 'callerid': chat_id })  
            await self.sender.sendMessage( reply, reply_markup=service_keyboard)
            return
        # bot btc
        if(user.bot_btc_state):           
            reply = callAPI('btc', {'usersay': msg, 'channel': 'tg', 'callerid': chat_id })  
            await self.sender.sendMessage( reply, reply_markup=service_keyboard)
            return
        # bot mining profit
        if(user.mining_profit_state):            
            reply = callAPI('mine', {'usersay': msg, 'channel': 'tg', 'callerid': chat_id })           
            await self.sender.sendMessage(reply)
            return     

       

        # # # # # # # # # # # # # # # # # # # #
        # User manual input search for coins #
        # # # # # # # # # # # # # # # # # # #  

        # ALTCOIN
        if(msg.lower()[0:4] == 'bot 'and msg.upper()[4:] in ALTCOINS):             
            reply = callAPI('coin', {'coin': msg.lower()[4:], 'usersay': msg, 'channel': 'tg', 'callerid': chat_id })           
            await self.sender.sendMessage(reply)
            return
             
        # TWBCOINS
        if(msg.lower()[0:4] == 'bot 'and msg.upper()[4:] in TWBCOINS):             
            reply = callAPI('currency', {'coin': msg.lower()[4:], 'usersay': msg, 'channel': 'tg', 'callerid': chat_id })           
            await self.sender.sendMessage(reply)
            return
        # POLO
        if(msg.lower()[0:9] == 'bot polo '):            
            reply = callAPI('polo', {'coin': msg.lower()[9:], 'usersay': msg, 'channel': 'tg', 'callerid': chat_id })           
            await self.sender.sendMessage(reply)
            return

        # # # # # ## # # # # # # # # # # #
        # Query with Callback functions  #
        # bot coin  (alt)                #
        # bot coin  (TWB)                #
        # bot polo                       #
        # bot ethwallet                  #
        # bot miner                      #
        # # # # # # # # # # # # # # # # # 
        
        # bot altcoin query 
        if(user.altcoin_state):    
            for idx, altcoin in enumerate(ALTCOINS):    
                if(idx < int(len(ALTCOINS)/2)):               
                    keyboard1.append(InlineKeyboardButton(text = altcoin, callback_data = 'ALT_QUERY_' + altcoin ))
                else:
                    keyboard2.append(InlineKeyboardButton(text = altcoin, callback_data = 'ALT_QUERY_' + altcoin ))     
            inline_keyboard = InlineKeyboardMarkup(inline_keyboard=[
                        keyboard1, keyboard2
                    ])                      
            await self.sender.sendMessage("選擇要查詢的幣種", reply_markup=inline_keyboard)
            user.altcoin_state = False
            user.general_state = True
            return

        # bot coin, bank of taiwan query
        if(user.bankofTW_state):  
            for idx, altcoin in enumerate(TWBCOINS):    
                if(idx < 5):               
                    keyboard1.append(InlineKeyboardButton(text = altcoin, callback_data = 'TWB_QUERY_' + altcoin ))                 
            inline_keyboard = InlineKeyboardMarkup(inline_keyboard=[
                        keyboard1
                    ])         
            await self.sender.sendMessage("[台銀]選擇要查詢的幣種\n若要查詢其他幣種，可以輸入 bot coin 以查詢\n範例： bot usd", reply_markup=inline_keyboard)
            user.bankofTW_state = False
            user.general_state = True
            return
        
        # bot polo, Poloniex query
        if(user.poloniex_state):  
            for idx, altcoin in enumerate(ALTCOINS):    
                if(idx < int(len(ALTCOINS)/2)):               
                    keyboard1.append(InlineKeyboardButton(text = altcoin, callback_data = 'POLO_QUERY_' + altcoin ))
                else:
                    keyboard2.append(InlineKeyboardButton(text = altcoin, callback_data = 'POLO_QUERY_' + altcoin ))     
            inline_keyboard = InlineKeyboardMarkup(inline_keyboard=[
                        keyboard1, keyboard2
                    ])         
            await self.sender.sendMessage("[Poloniex]選擇要查詢的幣種\n若要查詢其他幣種，可以輸入 bot polo coin 以查詢\n範例： bot polo doge", reply_markup=inline_keyboard)
            user.poloniex_state = False
            user.general_state = True
            return

        # eth wallet
        if(user.eth_wallet_state):
            if(user.eth_wallet_subsribe_state):
                if(isValidEthAddress(msg)):
                    user.eth_wallet_subsribe = True
                    await self.sender.sendMessage("註冊成功")                   
                else:
                    await self.sender.sendMessage("不合法地址")     
                user.eth_wallet_subsribe_state = False
                user.eth_wallet_state = False
                user.general_state = True          
                return
            inline_keyboard = InlineKeyboardMarkup(inline_keyboard=[
                       [InlineKeyboardButton(text = '新增地址', callback_data = 'ETH_WALLET_SUB'), InlineKeyboardButton(text = '查詢紀錄', callback_data = 'ETH_WALLET_QUERY')]
                    ])    
            sent = await self.sender.sendMessage("[ETH錢包]選擇操作", reply_markup=inline_keyboard)
            self._editor = telepot.aio.helper.Editor(self.bot, sent)
        # mc miner
        if(user.mc_mine_state):
            if(user.mc_mine_subsribe_state):
                if(isValidEthAddress(msg)):
                    user.mc_mine_subsribe = True
                    await self.sender.sendMessage("註冊成功")
                    if(self._editor):
                        await self._editor.editMessageReplyMarkup(reply_markup=None)                   
                else:
                    await self.sender.sendMessage("不合法地址")  
                    if(self._editor):
                        await self._editor.editMessageReplyMarkup(reply_markup=None)   
                user.mc_mine_state = False
                user.mc_mine_subsribe_state = False
                user.general_state = True          
                return
            inline_keyboard = InlineKeyboardMarkup(inline_keyboard=[
                       [InlineKeyboardButton(text = '新增地址', callback_data = 'MC_MINE_SUB'), InlineKeyboardButton(text = '查詢礦工', callback_data = 'MC_MINE_QUERY')]
                    ])    
            sent = await self.sender.sendMessage("[MC礦工查看]選擇操作", reply_markup=inline_keyboard)
            self._editor = telepot.aio.helper.Editor(self.bot, sent)
        
         # # # # # ## # # # # # # # # # # #
        # Callback functions End          #
        # # # # # # # # # # # # # # # # #     
        
       
        # Default reply
        if user.general_state == True:
            await self.sender.sendMessage( '您好，請問您需要什麼服務？', reply_markup=service_keyboard)

    # Cancel inline keyboard      
    async def _cancel_last(self):
        if hasattr(self, '_editor'):
            if(self._editor):
                await self._editor.editMessageReplyMarkup(reply_markup=None)
                self._editor = None
                self._edit_msg_ident = None

    # Callback queries
    async def on_callback_query(self, msg):
        query_id, chat_id, query_data = telepot.glance(msg, flavor='callback_query')    

        # For altcoin query search 
        if "ALT_QUERY_" in query_data:            
            coin = query_data.split('_')[2]
            await self.bot.answerCallbackQuery(query_id, text= coin + "查詢中...")
            reply = callAPI('coin', {'coin': coin, 'usersay': 'bot '+ coin, 'channel': 'tg', 'callerid': chat_id })            
            await self.sender.sendMessage(reply)           
            
        
        # For bank of Taiwan query search 
        if "TWB_QUERY_" in query_data:            
            coin = query_data.split('_')[2]
            await self.bot.answerCallbackQuery(query_id, text= coin + "查詢中...")
            reply = callAPI('currency', {'coin': coin, 'usersay': 'bot '+ coin, 'channel': 'tg', 'callerid': chat_id })            
            await self.sender.sendMessage(reply)             
        
        # For altcoin query search 
        if "POLO_QUERY_" in query_data:
            coin = query_data.split('_')[2]
            await self.bot.answerCallbackQuery(query_id, text= coin + "查詢中...")
            reply = callAPI('polo', {'coin': coin, 'usersay': 'bot polo '+ coin, 'channel': 'tg', 'callerid': chat_id })
            await self.sender.sendMessage(reply)
        
        # For eth wallet 
        if "ETH_WALLET_" in query_data:
            user = getUser(chat_id)
            option = query_data.split('_')[2]            
            if(option == 'SUB'):
                user.eth_wallet_subsribe_state = True
                await self.bot.answerCallbackQuery(query_id, text= "請在輸入欄輸入0x地址")
            if(option == 'QUERY'):
                if(not user.eth_wallet_subsribe):                      
                    await self.sender.sendMessage("請先新增地址")                                       
                else:
                    # demo, @backend involve
                    mStr = '[ETH last tx]\n'
                    mStr += '[37977782]\n'
                    mStr += '測試用字串測試用字串測試用字串\n'
                    mStr += 'The quick brown fox jumps over the lazy dog\n'
                    mStr += 'https://etherscan.io/address/0xddaed2e6ae80862cc1084a8bc5816a28bbbc97f6'
                    await self.sender.sendMessage(mStr)
            await self._cancel_last() 

         # For MC MINE
        if "MC_MINE_" in query_data:
            user = getUser(chat_id)
            option = query_data.split('_')[2]            
            if(option == 'SUB'):
                user.mc_mine_subsribe_state = True
                await self.bot.answerCallbackQuery(query_id, text= "請在輸入欄輸入0x地址")
            if(option == 'QUERY'):
                if(not user.mc_mine_subsribe):                      
                    await self.sender.sendMessage("請先新增地址")                                      
                else:               
                    await self.sender.sendMessage(MC_MINE_MESSAGE)
            await self._cancel_last() 
            


def callAPI(name, data):
    r = requests.post('http://150.95.147.150:3000/' + name, data = data)
    reply_obj = json.loads(r.content.decode('utf-8'))
    return reply_obj['ans']  

TOKEN = sys.argv[1]  # get token from command-line

bot = telepot.aio.DelegatorBot(TOKEN, [
    include_callback_query_chat_id(
        pave_event_space())(
        per_chat_id(), create_open, GPUMiningBot, timeout= 120),
])

loop = asyncio.get_event_loop()
loop.create_task(MessageLoop(bot).run_forever())
print('Listening ...')
loop.run_forever()