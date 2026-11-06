-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_subject_id_fkey";

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
