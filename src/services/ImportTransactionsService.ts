import csvParse from 'csv-parse';
import fs from 'fs';
import {getRepository, getCustomRepository, In} from 'typeorm';


interface CSVTransaction{
  title:string;
  type: 'income' | 'outcome';
  value:number;
  category:string;
}


import Transaction from '../models/Transaction';
import parse from 'csv-parse';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

class ImportTransactionsService {
  async execute(filePath:string): Promise<Transaction[]> {
    // TODO
    const fileReadStream = fs.createReadStream(filePath);
    const parsers = csvParse({
      from_line:2,
    });

    const transactions:CSVTransaction[] = [];
    const categories:string []= [];
    const parseCSV = fileReadStream.pipe(parsers);
    parseCSV.on('data', async line=>{
      const [title, type, value, category] = line.map((cell:string)=> cell.trim(),);
      if (!title || !type || !value) return;
      categories.push(category);
      transactions.push({title, type, value, category});

    });

    await new Promise(resolve=>parseCSV.on('end', resolve));

    const categoriesRepository = getRepository(Category);
    
    const existentCategories = await categoriesRepository.find({
      where:{title: In(categories)}
    });

    const existentCategoriesTitles = existentCategories.map((category: Category) => category.title);
    
    const addCategoryTitles = categories.filter(category => 
      !existentCategoriesTitles.includes(category)).filter((value, index, self)=> 
      self.indexOf(value) === index);

      const newCategories = categoriesRepository.create(
        addCategoryTitles.map(title=>({
          title,
        })),  
      );

      await categoriesRepository.save(newCategories);
      const insertedCategories = [...newCategories, ...existentCategories];
      const transactionsRepository = getRepository(Transaction);
      const createdTransactions   = transactionsRepository.create(
        transactions.map(transaction =>({
          title:transaction.title,
          type:transaction.type,
          value:transaction.value,
          category: insertedCategories.find(
            category=> category.title === transaction.category,
          )
        })),
      );
    
    console.log(addCategoryTitles);
    await transactionsRepository.save(createdTransactions);
    await fs.promises.unlink(filePath);

    return createdTransactions;

    
 
  }
  
}

export default ImportTransactionsService;
