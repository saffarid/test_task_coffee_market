import { sleep } from './utils'

export const emulator = {

   /**
    * Флаг активности купюроприемника
    * */
   cashin: false,
   /**
    * Флаг активности терминала оплаты картой
    * */
   cardin: false,
   cardPurchasePromise: null,
   cashPurchasePromise: null,
   addDeposit: 0,
   isSuccess: 0,

   StartCashin(cb) {
      // Включает купюроприёмник на приём купюр/монет, с каждой принятой купюрой/монетой вызывает cb(amount), где
      // amount - номинал купюры/монеты Эмуляция приёма купюр должна производится по нажатию комбинации клавиш - на
      // ваше усмотрение
      this.cashPurchasePromise = new Promise(async () => {
         this.cashin = true
         do {
            await sleep(500)

            if(this.addDeposit != 0) {
               cb(this.addDeposit)
               this.addDeposit = 0
            }

         } while (this.cashin)
      })

   },


   StopCashin(cb) {
// Отключает прием купюр/монет купюроприемником
      console.log(['StopCashin', this.cashin])
      this.cashin = false
      console.log(['StopCashin', this.cashin])
   },

   BankCardPurchase(amount, cb, display_cb) {

      this.cardPurchasePromise = new Promise(async () => {

         await sleep(500)
         display_cb('Приложите карту. Shift+Y - приложить, Shift+C - отменить ввод картой')
         this.cardin = true
         do {
            await sleep(500)
         } while (this.isSuccess != 1 && this.cardin)

         if (this.isSuccess == 1) {
            //Приложили карту и обрабатываем её
            display_cb('Обработка карты')
            await sleep(2000)
            display_cb('Связь с банком. Транзакция завершена успешно завершена? Shift+Y - да, Shift+N - нет')
            this.isSuccess = 0
            do {
               await sleep(500)
            } while (this.isSuccess == 0)
            if (this.isSuccess == 1) {
               display_cb('Банк одобрил транзакцию')
               cb(true)
            }
            else{
               display_cb('Банк заблокировал подозрительный перевод средств')
               cb(false)
            }
         }
         else {
            display_cb('Операция оплаты отменена пользователем')
            cb(false)
         }
         this.cardin = false
         this.isSuccess = 0
      })

      // Активирует списание с банковской карты  на сумму amount
      // Активация успешной или неуспешной транзакции должна производится по нажатию комбинаций клавиш - на ваше
      // усмотрение При успешной / неуспешной транзакции выполняется cb (result), где result - результат операции
      // (true/false)
// При оплате также эмулируются надписи от пин-пада - display_cb, т.е. вызовы:
// display_cb (‘Приложите карту’);
// display_cb (‘Обработка карты’);
// display_cb (‘Связь с банком’);
// и т.д.
// По окончанию выдается текстовый результат также в display_cb
   },

   BankCardCancel() {
// Отмена действующей операции по банковской карте
// BankCardCancel только запускает процесс отмены, при этом должен завершиться штатный механизм BankCardPurchase с
// коллбэками
      this.cardin = false
   },

   Vend(product_idx, cb) {

      new Promise(async () => {
         do {
            await sleep(500)
         } while (this.isSuccess == 0)
         if (this.isSuccess == 1) {
            cb(true)
         }
         else {
            cb(false)
         }
         this.isSuccess = 0
      })

// Выдача кофе с индексом product_idx (индексы в порядке, в котором они идут на первом экране)
// Активация успешной или неуспешной выдачи должна производится по нажатию комбинаций клавиш - на ваше усмотрение
      // При успешной / неуспешной транзакции выполняется cb (result), где result - результат операции (true/false)
   },
}