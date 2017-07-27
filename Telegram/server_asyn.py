import sys
import time, datetime
import re
import asyncio
import telepot
from telepot.aio.loop import MessageLoop
from telepot.aio.delegate import per_chat_id, create_open, pave_event_space, include_callback_query_chat_id
from telepot.namedtuple import InlineQueryResultArticle, InputTextMessageContent
from telepot.namedtuple import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove, KeyboardButton

"""
$ python3.5 countera.py <token>
Counts number of messages a user has sent. Starts over if silent for 10 seconds.
Illustrates the basic usage of `DelegateBot` and `ChatHandler`.
"""


BOT_BTC = 'BTC查詢'
ALTCOIN_QUERY = 'Altcoin查詢'
BANKTW_QUERY = '台銀匯率查詢'
POLONIEX_QUERY = 'P網查詢'
BOT_MINE = '挖礦收益'
ETH_WALLET = 'ETH錢包紀錄查詢'
MC_MINE = 'MC礦工查看'
HELP = 'HELP'
# TEMP HARD CODE FOR NOW
HELP_MESSAGE = '[指令]\n[ BTC查詢 ] bot btc \n[ Altcoin查詢 ] bot eth/exp/etc/xmr/zec/mc/ltc/xrp \n[ 臺銀匯率查詢 ] bot {coin} \n[ P網查詢 ] bot polo {coin} \n[ 挖礦收益 ] bot mine \n [台灣MC礦池] music.gpumine.org \n [ ETH錢包紀錄查詢 ] bot ethwallet \n [ MC礦工查看 ] bot miner add 0x地址 \n [ MC礦工查看 ] bot miner \n [ FB挖礦社團 ]https://goo.gl/mB1wKV \n [ 聯絡作者Line ] holise71'
BOT_BTC_MESSAGE =  '[BTC] \n[ bitoex_buy ] 83091(TWD) \n[ bitoex_sell ] 75928(TWD) \n[ maicoin_buy ] 83000.46(TWD) \n[ maicoin_price ] 76968.17(TWD) \n[ maicoin_sell ] 75946.14(TWD) \n[ btcchina ] 17700.02(CNY) \n[ huobi ] 17673(CNY) \n[ okcoin_cn ] 17640(CNY) \n[ bitfinex ] 2519.1(USD) \n[ btc-e ] 2500(USD) \n[ itbit ] 2550.61(USD) \n[ localbitcoins ] 3480.07(USD) \n[ okcoin ] 2616.03(USD) \n[ kraken ] 2238.549(EUR) \n[ TWD2CNY ] 4.497 \n[ TWD2EUR ] 34.93\n[ TWD2USD ] 30.585 2616.03(USD) \n[ kraken ] 2238.549(EUR) \n[ TWD2CNY ] 4.497 \n[ TWD2EUR ] 34.93\n[ TWD2USD ] 30.585'

MC_MINE_MESSAGE = ' [ GPUmine Music pool ] \n[ Miner ] -> 0x6746b0b11f2c723ae85a016744481b00cb13a007\n[ Hashrate ] -> 90 MHS\n[ Penging   ] -> 36\n[ TotalPaid ] -> 4741\n [ LastPaid time ] \n2017/07/09 21:42:29\n[ LastPaid amount ] \n91.624412607\nearn/day -> 255.371\nbtc/day -> 0.002844\nusd/day -> 7.2\n ntd/day -> 216.99\n[ worker ] -> 2 / 0\n[ lastshare ] -> 2017/07/10 00:31:46 \n HARDCODE FOR TEST\n'


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
        if(msg == MC_MINE or msg.lower == 'mc mine'):            
                
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
    
 

class CoinInfo:
    def __init__(self, coin):
        self.id = coin
        self.coin2BTC = { 'name': '[ BTC ]', 'value': 0.0}
        self.coin2TWD = { 'name': '[ TWD ]', 'value': 0.0}
        self.coin2USDT = { 'name': '[ USDT ]', 'value': 0.0}

class MiningPower:
    def __init__(self, htype, hashrate, unit):
        self.type = htype
        self.hash = hashrate
        self.unit = unit
    

class MiningProfit:
    def __init__(self, coin, time):
        self.id = coin
        # self.mining_power = {'ETHhash': 28, 'ZEChash': 300, 'XMRhash': 700}
        self.time = time
        self.diff = { 'name': 'diff', 'value': '10t'}
        self.earn_per_day = { 'name': 'earn/day', 'value': '100'}
        self.btc_per_day = { 'name': 'btc/day', 'value': '0.0001'}
        self.usd_per_day = { 'name': 'usd/day', 'value': '2.21'}
        self.ntd_per_day = { 'name': 'ntd/day', 'value': '80'}


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
service_keyboard = ReplyKeyboardMarkup(
                            keyboard=[
                                [KeyboardButton(text=BOT_BTC),KeyboardButton(text=ALTCOIN_QUERY)], 
                                [KeyboardButton(text=BANKTW_QUERY),KeyboardButton(text=POLONIEX_QUERY)],
                                [KeyboardButton(text=BOT_MINE),KeyboardButton(text=ETH_WALLET)],
                                [KeyboardButton(text=MC_MINE),KeyboardButton(text=HELP)],
                            ]
                        )  

class MessageCounter(telepot.aio.helper.ChatHandler):
    
    def __init__(self, *args, **kwargs):
        super(MessageCounter, self).__init__(*args, **kwargs)    
        self._count = 0
       

    async def on_chat_message(self, msg):     
        self._count += 1
        # bad practice, temporarily 
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

        # exceptional fix
        # if(msg == ETH_WALLET and user.eth_wallet_state and not user.eth_wallet_subsribe_state):
        #     await self._cancel_last()
        # if(msg == MC_MINE and user.mc_mine_state and not user.mc_mine_subsribe_state):
        #     await self._cancel_last()
        await self._cancel_last()
        user.getState(msg)


          
       
        
        
       
        # help
        if(user.help_state):
            await self.sender.sendMessage( HELP_MESSAGE, reply_markup=service_keyboard)
            return
        # bot btc
        if(user.bot_btc_state):
            await self.sender.sendMessage( BOT_BTC_MESSAGE, reply_markup=service_keyboard)
            return
        # bot mining profit
        if(user.mining_profit_state):
            # @backend data involve
            targets = ['ETH', 'MC', 'ZEC', 'XMR']
            mining_power = [MiningPower('ETHhash', 28, 'MHS'), MiningPower('ZEChash', 300 ,'sol'), MiningPower('XMRhash', 700, 'h')]
            curTime = datetime.datetime.fromtimestamp(int(time.time())).strftime('%Y-%m-%d %H:%M:%S')
            mining_profits = []
            for target in targets:
                mining_profits.append(MiningProfit(target, curTime))           

            mStr = ''
            mStr += '[Mine]\n'
            for mpr in mining_power:
                mStr += '[' + mpr.type + ']' + ' ' + str(mpr.hash) + mpr.unit + '\n'
            mStr += '\n'
            for mp in mining_profits:
                mStr += '[' + mp.id + ']' + ' ' + mp.time + '\n'
                mStr += mp.diff['name'] + ' -> ' + mp.diff['value'] + '\n'
                mStr += mp.earn_per_day['name'] + ' -> ' + mp.earn_per_day['value'] + '\n'
                mStr += mp.btc_per_day['name'] + ' -> ' + mp.btc_per_day['value'] + '\n'
                mStr += mp.ntd_per_day['name'] + ' -> ' + mp.ntd_per_day['value'] + '\n\n'             
            await self.sender.sendMessage(mStr)
            return
            
        
        

        # altcoin query 
        if(user.altcoin_state):    
            for idx, altcoin in enumerate(ALTCOINS):    
                if(idx < int(len(ALTCOINS)/2)):               
                    keyboard1.append(InlineKeyboardButton(text = altcoin, callback_data = 'ALT_QUERY_' + altcoin ))
                else:
                    keyboard2.append(InlineKeyboardButton(text = altcoin, callback_data = 'ALT_QUERY_' + altcoin ))     
            inline_keyboard = InlineKeyboardMarkup(inline_keyboard=[
                        keyboard1, keyboard2
                    ])    
            print('ready to alt')                   
            await self.sender.sendMessage("選擇要查詢的幣種", reply_markup=inline_keyboard)
            user.altcoin_state = False
            user.general_state = True
            return

        # bank of taiwan query
        if(user.bankofTW_state):  
            for idx, altcoin in enumerate(ALTCOINS):    
                if(idx < int(len(ALTCOINS)/2)):               
                    keyboard1.append(InlineKeyboardButton(text = altcoin, callback_data = 'TWB_QUERY_' + altcoin ))
                else:
                    keyboard2.append(InlineKeyboardButton(text = altcoin, callback_data = 'TWB_QUERY_' + altcoin ))     
            inline_keyboard = InlineKeyboardMarkup(inline_keyboard=[
                        keyboard1, keyboard2
                    ])         
            await self.sender.sendMessage("[台銀]選擇要查詢的幣種", reply_markup=inline_keyboard)
            user.bankofTW_state = False
            user.general_state = True
            return
        
        # Poloniex query
        if(user.poloniex_state):  
            for idx, altcoin in enumerate(ALTCOINS):    
                if(idx < int(len(ALTCOINS)/2)):               
                    keyboard1.append(InlineKeyboardButton(text = altcoin, callback_data = 'POLO_QUERY_' + altcoin ))
                else:
                    keyboard2.append(InlineKeyboardButton(text = altcoin, callback_data = 'POLO_QUERY_' + altcoin ))     
            inline_keyboard = InlineKeyboardMarkup(inline_keyboard=[
                        keyboard1, keyboard2
                    ])         
            await self.sender.sendMessage("[Poloniex]選擇要查詢的幣種", reply_markup=inline_keyboard)
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
            



        if user.general_state == True:
            await self.sender.sendMessage( '您好，請問您需要什麼服務？', reply_markup=service_keyboard)
    async def _cancel_last(self):
        if hasattr(self, '_editor'):
            if(self._editor):
                await self._editor.editMessageReplyMarkup(reply_markup=None)
                self._editor = None
                self._edit_msg_ident = None

    async def on_callback_query(self, msg):
        query_id, chat_id, query_data = telepot.glance(msg, flavor='callback_query')    

        # For altcoin query search 
        if "ALT_QUERY_" in query_data:
            coin = query_data.split('_')[2]
            await self.bot.answerCallbackQuery(query_id, text= coin + "查詢中...")
            mCoin = CoinInfo(coin)
            await self.sender.sendMessage('[' + mCoin.id + ']\n' 
              + mCoin.coin2BTC['name'] + ' ' + str(mCoin.coin2BTC['value']) + '\n' 
              + mCoin.coin2TWD['name'] + ' ' + str(mCoin.coin2TWD['value']) + '\n' 
              + mCoin.coin2USDT['name'] + ' ' + str(mCoin.coin2USDT['value']))
        
        # For bank of Taiwan query search 
        if "TWB_QUERY_" in query_data:
            coin = query_data.split('_')[2]
            await self.bot.answerCallbackQuery(query_id, text= coin + "查詢中...")
            mCoin = CoinInfo(coin)
            await self.sender.sendMessage('[' + mCoin.id + ']\n' 
              + mCoin.coin2USDT['name'] + ' ' + str(mCoin.coin2USDT['value']) + '\n'
              + mCoin.coin2BTC['name'] + ' ' + str(mCoin.coin2BTC['value']))
             
        
        # For altcoin query search 
        if "POLO_QUERY_" in query_data:
            coin = query_data.split('_')[2]
            await self.bot.answerCallbackQuery(query_id, text= coin + "查詢中...")
            mCoin = CoinInfo(coin)
            await self.sender.sendMessage('[' + mCoin.id + ']\n' 
              + mCoin.coin2USDT['name'] + ' ' + str(mCoin.coin2USDT['value']) + '\n'
              + mCoin.coin2BTC['name'] + ' ' + str(mCoin.coin2BTC['value']))
        
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
            



TOKEN = sys.argv[1]  # get token from command-line

bot = telepot.aio.DelegatorBot(TOKEN, [
    include_callback_query_chat_id(
        pave_event_space())(
        per_chat_id(), create_open, MessageCounter, timeout= 120),
])

loop = asyncio.get_event_loop()
loop.create_task(MessageLoop(bot).run_forever())
print('Listening ...')
loop.run_forever()