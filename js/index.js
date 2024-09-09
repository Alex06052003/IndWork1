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
btnExcel.addEventListener("click", () => {
    // Создаем новый объект Workbook
    const workbook = XLSX.utils.book_new();

    // Изменяем внешний вид даты
    const date1 = editDate(1);
    const date2 = editDate(2);

    // Создаем данные, которые нужно сохранить
    const excelData = [
        [`Уважаемые ${data[0].value}!`],
        [""],
        [
            `Сообщаем вам, что ${date1} года состоится семинар по внедрению новых образовательных технологий. Мероприятие будет проходить в формате круглого стола с участием ведущих экспертов в данной области.`,
        ],
        [""],
        [
            `Для участия необходимо зарегистрироваться до ${date2} года. Заявки на участие принимаются по электронной почте ${data[3].value}. В заявке необходимо указать:`,
        ],
        [""],
        [[""], "Ваши ФИО;"],
        [[""], "Должность и место работы;"],
        [[""], "Контактный телефон;"],
        [
            [""],
            "Краткое описание вашего опыта работы с образовательными технологиями.",
        ],
        [""],
        [
            `Мероприятие пройдет в конференц-зале учебного корпуса №${data[4].value}. Время начала – ${data[5].value}.`,
        ],
        [""],
        ["Ждём вашего активного участия и будем рады видеть вас на семинаре!"],
    ];

    // Преобразуем массив данных в рабочий лист Excel
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // Настраиваем стили для обычных ячеек с Times New Roman
    const normalStyle = {
        font: { name: "Times New Roman", sz: 12 }, // Шрифт Times New Roman, размер 12
        alignment: { wrapText: true, vertical: "center", horizontal: "left" }, // Перенос текста, выравнивание
    };

    // Настраиваем стили для жирных ячеек
    const boldStyle = {
        font: { name: "Times New Roman", sz: 12, bold: true }, // Шрифт Times New Roman, размер 12, жирный
        alignment: { wrapText: true, vertical: "center", horizontal: "left" },
    };

    // Применяем стили ко всем ячейкам
    Object.keys(worksheet).forEach((cell) => {
        if (cell[0] !== "!") {
            worksheet[cell].s = normalStyle;
        }
    });

    // Применяем жирный стиль к первой строке
    worksheet["A1"].s = boldStyle;

    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(workbook, worksheet, "Текст");

    // Сохраняем файл как Excel (.xlsx)
    XLSX.writeFile(workbook, "text.xlsx");
});
