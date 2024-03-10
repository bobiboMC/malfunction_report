<script lang="ts">
  import { enhance } from "$app/forms";
  import { readFile, utils } from "xlsx";
  import XLSX from "xlsx";

  let data;
  let errorMsg: string;

  async function sendMessage(event) {
    const response = fetch("public/excel/department.xlsx")
      .then((res) => {
        return res.arrayBuffer();
      })
      .then((res) => {
        console.log("file:", res);
        const wb = XLSX.read(new Uint8Array(res), {
          type: "array",
        });
        const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        console.log(data, "workbook");
        const formData = new FormData(event.target);
        const name = formData.get("name");
        const issue = formData.get("issue");
        const departmentValue = formData.get("department");
        const department = data.find((d) => d.department === departmentValue);
        if (!department) {
          errorMsg = "internal error";
          throw new Error("Something wrong with the department");
          return;
        }

        const message = `https://web.whatsapp.com/send?phone=${department.number}&text=שם:${name}%0Aתקלה:${issue}`;
        window.location.href = message;
      })
      .catch((error) => {
        console.error(error);
      });
  }
</script>

<div lang="he" dir="rtl">
  <h1>טופס דיווח תקלה</h1>
  <form id="reportForm" on:submit={sendMessage}>
    <label for="name">שם:</label>
    <input type="text" id="name" name="name" required /><br /><br />
    <label for="issue">תקלה:</label><br />
    <textarea id="issue" name="issue" required></textarea><br /><br />
    <label for="department">למי לשלוח:</label>
    <select id="department" name="department">
      <option value="system">סיסטם</option>
      <option value="computing">מיחשוב</option>
    </select><br /><br />
    <button type="submit">שליחה</button>
    {#if errorMsg}
      <span class="error">בעיה עם השרת, אנא נסה שנית מאוחר יותר</span>
    {/if}
  </form>
</div>

<style>
  .error {
    color: red;
  }
</style>
