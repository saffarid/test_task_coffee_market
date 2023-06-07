import React           from 'react'
import { getStore }    from '../../../store/store'
import { paymentMode } from '../../../js/paymentMode'
import { emulator }    from '../../../js/emulator'

export class Terminal extends React.Component {
   constructor(props, context) {
      super(props, context)
      this.state = {
         messages: [],
      }
      this.lastTimeChangeState = Date.now()
   }

   addMessage = (message) => {
      this.setState((prevState) => {
         return {
            ...prevState,
            messages: [...prevState.messages, message],
         }
      })
   }

   changePaymentMode = (newPaymentMode) => {
      this.setState((prevState) => {

         let milliseconds = Date.now()
         let number = milliseconds - this.lastTimeChangeState
         if (number < 50) return { ...prevState }

         console.log('Одобрено изменение state')
         const globalState = getStore().getState()
         if (newPaymentMode != prevState.paymentMode) {
            if (prevState.paymentMode == paymentMode.card) {
               this.addMessage('Отключаю терминал оплаты картой')
               emulator.BankCardCancel()
            }
            if (prevState.paymentMode == paymentMode.cash) {
               this.addMessage('Отключаю терминал наличными')
               emulator.StopCashin()
            }

            if (newPaymentMode == paymentMode.cash) {
               this.addMessage('Включен терминал оплаты наличными. Внесите наличные на депозит. Shift+1 = 10р, Shift+2 = 50р, Shift+3 = 100р, Shift+4 = 500р, Shift+C заершить вносить деньги.')
               emulator.StartCashin(this.addToDepositCash)
            }
            if (newPaymentMode == paymentMode.card) {
               this.addMessage('Включен терминал оплаты картой')
               emulator.BankCardPurchase(globalState.get('coffee').price, this.addToDepositFromCard, this.addMessage)
            }
            if (newPaymentMode == paymentMode.noMode) {
               this.addMessage('Выберите действие. Shift+W - оплата картой, Shift+E - оплата наличными, Enter - оплата.')
            }
         }

         this.lastTimeChangeState = Date.now()

         return {
            ...prevState,
            paymentMode: newPaymentMode,
         }
      })
   }

   addToDepositFromCard = (isSucces) => {
      const globalState = getStore().getState()
      if (isSucces) {
         this.props.addDeposit(parseFloat(globalState.get('coffee').price) - parseFloat(this.state.deposit))
      }
      this.changePaymentMode(paymentMode.noMode)
   }

   addToDepositCash = (cash) => {
      this.props.addDeposit(parseInt(cash))
   }

   vendCallback = (isSuccess) => {
      const globalState = getStore().getState()

      if (isSuccess) {
         this.addToDepositCash(-1 * globalState.get('coffee').price)
         this.addMessage('Операция выдачи кофе выполнена')
      }
      else {
         this.addMessage('Операция выдачи кофе не выполнена')
      }
      this.changePaymentMode(paymentMode.noMode)
   }

   keyUp = (e) => {
      const globalState = getStore().getState()
      if (e.shiftKey) {
         if (this.state.paymentMode == paymentMode.cash) {
            //Эмуляция ввода 10р
            if (e.code == 'Digit1') {
               emulator.addDeposit = 10
            }
            //Эмуляция ввода 50р
            else if (e.code == 'Digit2') {
               emulator.addDeposit = 50
            }
            //Эмуляция ввода 100р
            else if (e.code == 'Digit3') {
               emulator.addDeposit = 100
            }
            //Эмуляция ввода 500р
            else if (e.code == 'Digit4') {
               emulator.addDeposit = 500
            }
         }

         //Оплата картой
         if (e.code == 'KeyW' && this.state.paymentMode == paymentMode.noMode) {
            this.changePaymentMode(paymentMode.card)
         }
         //Оплата наличными
         if (e.code == 'KeyE' && this.state.paymentMode == paymentMode.noMode) {
            this.changePaymentMode(paymentMode.cash)
         }
         if (this.state.paymentMode != paymentMode.noMode) {
            //Отключение любого терминала
            if (e.code == 'KeyC') {
               const prevPaymentMode = this.state.paymentMode
               if (prevPaymentMode == paymentMode.cash) {
                  emulator.StopCashin()
                  this.changePaymentMode(paymentMode.noMode)
               }
               else if (prevPaymentMode == paymentMode.card) {
                  emulator.BankCardCancel()
               }
            }
         }

         //Эмуляция успешности операции
         if (e.code == 'KeyY') {
            emulator.isSuccess = 1
         }
         //Эмуляция провала операции
         else if (e.code == 'KeyN') {
            emulator.isSuccess = -1
         }
      }
      //Оплата
      else if (e.code == 'Enter') {
         if (this.state.deposit >= globalState.get('coffee').price) {
            this.changePaymentMode(paymentMode.wait)
            this.addMessage('Выдача напитка. Успешно? Shift+Y - да, Shift+N - нет')
            emulator.Vend(globalState.get('coffee').id, this.vendCallback)
         }
         else {
            this.addMessage('На вашем депозите не достаточно средств для оплаты.')
         }
      }
   }

   componentDidMount() {
      const globalState = getStore().getState()
      document.removeEventListener('keyup', this.keyUp)
      document.addEventListener('keyup', this.keyUp)
      getStore().subscribe(() => {
         const globalState = getStore().getState()
         const _messages = []

         if (globalState.get('deposit') != this.state.deposit) {
            if (globalState.get('deposit') < this.state.deposit) {
               _messages.push(`Оплата произведена`)
            }
            else {
               _messages.push(`Депозит пополнен на ${globalState.get('deposit') - this.state.deposit} р`)
            }
         }

         this.setState((prevState) => {
            return {
               ...prevState,
               deposit: globalState.get('deposit'),
               messages: [...this.state.messages, ..._messages],
            }
         })
      })

      this.setState({
         deposit: globalState.get('deposit'),
         paymentMode: paymentMode.noMode,
         messages: ['Выберите действие. Shift+W - оплата картой, Shift+E - оплата наличными, Enter - оплата.'],
      })
   }

   render() {
      return <div>
         <ul>
            {this.state.messages.map(message => < li> {message}</li>)}
         </ul>
      </div>
   }
}


