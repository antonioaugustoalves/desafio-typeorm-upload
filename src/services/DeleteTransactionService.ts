import {getCustomRepository} from 'typeorm'
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id:string): Promise<void> {
    const trxRepository = getCustomRepository(TransactionsRepository);

    const transaction = await trxRepository.findOne(id);

    if(!transaction){
      throw new AppError('This transaction does not exist.');
    }

    await trxRepository.remove(transaction);

  }
}

export default DeleteTransactionService;
