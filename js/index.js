import { fonts } from "./fonts.js";

/*============= DOM ===============*/
/*============= DOM ===============*/

// Кнопки
const previewBtn = document.querySelector(".btn-primary");
const resetBtn = document.querySelector(".btn-secondary");
const closeBtn = document.querySelector(".close-btn");
const btnPdf = document.querySelector(".btn-danger");
const btnExcel = document.querySelector(".btn-success");

// Попап
const previewPage = document.querySelector(".preview-page");
const popup = document.querySelector(".popup");

// Введенные данные (spans)
const spans = document.querySelectorAll(".preview span");

// Поля ввода
const data = document.querySelectorAll(".data-input");

/*============= FUNCTIONS ===============*/
/*============= FUNCTIONS ===============*/

// Включаем предпросмотр и попап
function togglePreview() {
    popup.classList.toggle("popup-active");
    previewPage.classList.toggle("preview-page-active");
}

function editDate(i) {
    return data[i].value.split("-").reverse().join(".");
}

/*============= EVENTS ===============*/
/*============= EVENTS ===============*/

// Заполняем выходной документ и вы водим на экран
previewBtn.addEventListener("click", () => {
    // Изменяем внешний вид даты
    const date1 = editDate(1);
    const date2 = editDate(2);

    spans.forEach((item, index) => {
        if (index === 1) item.textContent = date1;
        else if (index === 2) item.textContent = date2;
        else
            data[index].value
                ? (item.textContent = data[index].value)
                : (item.textContent = `_______________`);
    });
    togglePreview();
});

// Выключение окна выходного документа
popup.addEventListener("click", togglePreview);
closeBtn.addEventListener("click", togglePreview);

// Сброс вводимых данных
resetBtn.addEventListener("click", () => {
    data.forEach((item) => (item.value = ""));
});

// Выгрузка .pdf файла
btnPdf.addEventListener("click", () => {
    // Изменяем внешний вид даты
    const date1 = editDate(1);
    const date2 = editDate(2);

    // Добавляем шрифты в виртуальную файловую систему (VFS)
    pdfMake.vfs = {
        "timesnrcyrmt.ttf": fonts.TimesNewRomanRegular,
        "timesnrcyrmt_bold.ttf": fonts.TimesNewRomanBold,
    };

    // Регистрируем шрифты в pdfMake
    pdfMake.fonts = {
        TimesNewRoman: {
            normal: "timesnrcyrmt.ttf",
            bold: "timesnrcyrmt_bold.ttf",
        },
    };

    // Определяем содержимое PDF
    const docDefinition = {
        content: [
            {
                text: `Уважаемые ${data[0].value}!`,
                fontSize: 14,
                bold: true,
                margin: [0, 0, 0, 16],
            },
            {
                text: `Сообщаем вам, что ${date1} года состоится семинар по внедрению новых образовательных технологий. Мероприятие будет проходить в формате круглого стола с участием ведущих экспертов в данной области.`,
                fontSize: 12,
                margin: [0, 0, 0, 16],
            },
            {
                text: `Для участия необходимо зарегистрироваться до ${date2} года. Заявки на участие принимаются по электронной почте ${data[3].value}. В заявке необходимо указать:`,
                fontSize: 12,
                margin: [0, 0, 0, 16],
            },
            {
                ul: [
                    `Ваши ФИО;`,
                    `Должность и место работы;`,
                    `Контактный телефон;`,
                    `Краткое описание вашего опыта работы с образовательными технологиями.`,
                ],
                fontSize: 12,
                margin: [20, 0, 0, 16],
            },
            {
                text: `Мероприятие пройдет в конференц-зале учебного корпуса №${data[4].value}. Время начала – ${data[5].value}.`,
                fontSize: 12,
                margin: [0, 0, 0, 16],
            },
            {
                text: `Ждём вашего активного участия и будем рады видеть вас на семинаре!`,
                fontSize: 12,
                margin: [0, 0, 0, 16],
            },
        ],
        defaultStyle: {
            font: "TimesNewRoman", // Если шрифт добавлен ранее
            lineHeight: 1,
        },
    };

    // Генерируем и сохраняем PDF
    pdfMake.createPdf(docDefinition).download("doc.pdf");
});

// Выгрузка Excel файла
btnExcel.addEventListener("click", async () => {
    // Создаем новый Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Текст");

    // Добавляем данные
    worksheet.addRow([`Уважаемые ${data[0].value}!`]).font = { name: "Arial", size: 12, bold: true };
    worksheet.addRow([""]);
    worksheet.addRow([`Сообщаем вам, что ${editDate(1)} года состоится семинар по внедрению новых образовательных технологий. Мероприятие будет проходить в формате круглого стола с участием ведущих экспертов в данной области.`]);
    worksheet.addRow([""]);
    worksheet.addRow([`Для участия необходимо зарегистрироваться до ${editDate(2)} года. Заявки на участие принимаются по электронной почте ${data[3].value}. В заявке необходимо указать:`]);
    worksheet.addRow([""]);
    worksheet.addRow(["", "Ваши ФИО;"]);
    worksheet.addRow(["", "Должность и место работы;"]);
    worksheet.addRow(["", "Контактный телефон;"]);
    worksheet.addRow(["", "Краткое описание вашего опыта работы с образовательными технологиями."]);
    worksheet.addRow([""]);
    worksheet.addRow([`Мероприятие пройдет в конференц-зале учебного корпуса №${data[4].value}. Время начала – ${data[5].value}.`]);
    worksheet.addRow([""]);
    worksheet.addRow(["Ждём вашего активного участия и будем рады видеть вас на семинаре!"]);

    // Применяем стиль ко всем ячейкам
    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
            cell.font = { name: "Arial", size: 12 }; // Применяем шрифт Arial, размер 12
            cell.alignment = { wrapText: false, vertical: "top", horizontal: "left" };
        });
    });

    // Применяем жирный стиль к первой строке
    worksheet.getRow(1).font = { name: "Times New Roman", size: 12, bold: true };

    // Генерируем и сохраняем файл Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted_text.xlsx";
    a.click();
    URL.revokeObjectURL(url);
});
