import { error } from "@sveltejs/kit";
import * as fs from "fs";
import { readFile, set_fs, utils } from "xlsx";
set_fs(fs);

export const actions = {
  sendMessage: async ({ locals, request }) => {
    const wb = readFile("static/excel/test_1.xlsx");
    const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    const formData = await request.formData();
    const name = formData.get("name");
    const issue = formData.get("issue");
    const departmentValue = formData.get("department");
    const department = data.find((d) => d.department === departmentValue);
    if (!department) {
      throw new Error("Something wrong with the department");
    }
    const message = `https://web.whatsapp.com/send?phone=${department.number}&text=שם:${name}%0Aתקלה:${issue}`;
    return message;
  },
};
