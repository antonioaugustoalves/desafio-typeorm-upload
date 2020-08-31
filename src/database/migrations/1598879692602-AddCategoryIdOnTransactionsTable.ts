import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export default class AddCategoryIdOnTransactionsTable1598879692602 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('transactions', new TableColumn({
            name:'category_id',
            type:'uuid',
            isNullable:true
        }));

        await queryRunner.createForeignKey('transactions', new TableForeignKey(
            {
                columnNames:['category_id'],
                referencedColumnNames:['id'],
                referencedTableName:'categories',
                name:'fk_transaction_category',
                onUpdate:'CASCADE',
                onDelete:'SET NULL',
            }
        ));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('transactions','fk_transaction_category');
        await queryRunner.dropColumn('transactions','category_id');
    }

}
