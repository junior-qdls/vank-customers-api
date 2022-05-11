import {MigrationInterface, QueryRunner} from "typeorm";

export class initdb1652254961736 implements MigrationInterface {
    name = 'initdb1652254961736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "invoiceId" character varying NOT NULL, "vendorId" character varying NOT NULL, "invoiceNumber" character varying NOT NULL, "invoiceDate" character varying NOT NULL, "invoiceTotal" character varying NOT NULL, "paymentTotal" character varying NOT NULL, "creditTotal" character varying NOT NULL, "bankId" integer NOT NULL, "invoiceDueDate" character varying NOT NULL, "paymentDate" character varying NOT NULL, "currency" character varying NOT NULL, CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank_record" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "bankRecordNumber" integer NOT NULL, "customer_id" integer, CONSTRAINT "PK_bf77589a71a8ee12cdfa7b7c837" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "companyName" character varying NOT NULL, "internalCode" character varying NOT NULL, "tributaryId" character varying NOT NULL, "currency" character varying NOT NULL, "apiQuotaCalls" integer NOT NULL, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bank_record" ADD CONSTRAINT "FK_ae841f4f8a18b3359deb256232b" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_record" DROP CONSTRAINT "FK_ae841f4f8a18b3359deb256232b"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "bank_record"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
    }

}
