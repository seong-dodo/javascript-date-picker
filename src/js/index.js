class DatePicker {
  monthData = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  #calendarDate = {
    data: "",
    date: 0,
    month: 0,
    year: 0,
  };

  selectedDate = {
    data: "",
    date: 0,
    month: 0,
    year: 0,
  };

  datePickerEl;
  dateInputEl;
  calendarEl;
  calendarMonthEl;
  monthContentEl;
  nextBtnEl;
  prevBtnEl;
  calendarDatesEl;

  constructor() {
    this.initCalendarDate();
    this.initSelectedDate();
    this.assignElement();
    this.setDateInput();
    this.addEvent();
  }

  initCalendarDate() {
    const data = new Date();
    const date = data.getDate();
    const month = data.getMonth();
    const year = data.getFullYear();
    this.#calendarDate = {
      data,
      date,
      month,
      year,
    };
  }

  initSelectedDate() {
    this.selectedDate = { ...this.#calendarDate };
  }

  setDateInput() {
    this.dateInputEl.textContent = this.formetDate(this.selectedDate.data);
    this.dateInputEl.dataset.value = this.selectedDate.data;
  }

  assignElement() {
    this.datePickerEl = document.getElementById("date-picker");
    this.dateInputEl = this.datePickerEl.querySelector("#date-input");
    this.calendarEl = this.datePickerEl.querySelector("#calendar");
    this.calendarMonthEl = this.calendarEl.querySelector("#month");
    this.monthContentEl = this.calendarMonthEl.querySelector("#content");
    this.nextBtnEl = this.calendarMonthEl.querySelector("#next");
    this.prevBtnEl = this.calendarMonthEl.querySelector("#prev");
    this.calendarDatesEl = this.calendarEl.querySelector("#dates");
  }

  addEvent() {
    this.dateInputEl.addEventListener("click", this.toggleCalendar.bind(this));
    this.nextBtnEl.addEventListener("click", this.moveToNextMonth.bind(this));
    this.prevBtnEl.addEventListener(
      "click",
      this.moveToPreviousMonth.bind(this)
    );
    this.calendarDatesEl.addEventListener(
      "click",
      this.onClickSelectedDate.bind(this)
    );
  }

  onClickSelectedDate(event) {
    const targetEl = event.target;
    console.log(targetEl);
    if (targetEl.dataset.date) {
      this.calendarDatesEl
        .querySelector(".selected")
        ?.classList.remove("selected");
      targetEl.classList.add("selected");

      this.selectedDate = {
        data: new Date(
          this.#calendarDate.year,
          this.#calendarDate.month,
          targetEl.dataset.date
        ),
        year: this.#calendarDate.year,
        month: this.#calendarDate.month,
        date: targetEl.dataset.date,
      };
      this.setDateInput();
      this.calendarEl.classList.remove("active");
    }
  }

  formetDate(dateData) {
    let date = dateData.getDate();
    if (date < 10) {
      date = `0${date}`;
    }

    let month = dateData.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let year = dateData.getFullYear();

    return `${year}-${month}-${date}`;
  }

  toggleCalendar() {
    this.calendarEl.classList.toggle("active");
    // 년 월에 대한 정보가 업데이트 되어야 한다.
    // 해당 월에 대한 날짜가 업데이트 되어야 한다.
    this.updateMonth();
    this.updateDates();
  }

  updateMonth() {
    this.monthContentEl.textContent = `${this.#calendarDate.year}년 ${
      this.monthData[this.#calendarDate.month]
    }`;
  }

  updateDates() {
    // 업데이트할 때 마다 비어 준 다음
    this.calendarDatesEl.innerHTML = "";

    const numberOfDates = new Date(
      this.#calendarDate.year,
      this.#calendarDate.month + 1,
      0
    ).getDate();

    const fragmenet = new DocumentFragment();
    for (let i = 0; i < numberOfDates; i++) {
      const dateEl = document.createElement("div");
      dateEl.classList.add("date");
      dateEl.dataset.date = i + 1;
      dateEl.textContent = i + 1;
      fragmenet.appendChild(dateEl);
    }
    fragmenet.firstChild.style.gridColumnStart =
      new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() +
      1;
    this.calendarDatesEl.appendChild(fragmenet);
    this.colorSaturday();
    this.colorSunday();
    this.markToday();
    this.markSelectedDate();
  }

  colorSaturday() {
    const target =
      7 -
      new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay();

    const saturdatEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${target})`
    );

    for (let i = 0; i < saturdatEls.length; i++) {
      saturdatEls[i].style.color = "blue";
    }
  }

  colorSunday() {
    const target =
      8 -
      (new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() %
        7);

    const sundayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${target})`
    );

    for (let i = 0; i < sundayEls.length; i++) {
      sundayEls[i].style.color = "red";
    }
  }

  markToday() {
    const currentData = new Date();
    const currentYear = currentData.getFullYear();
    const currentMonth = currentData.getMonth();
    const today = currentData.getDate();

    if (
      this.#calendarDate.year === currentYear &&
      this.#calendarDate.month === currentMonth
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${today}']`)
        .classList.add("today");
    }
  }

  markSelectedDate() {
    if (
      this.selectedDate.year === this.#calendarDate.year &&
      this.selectedDate.month === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${this.selectedDate.date}']`)
        .classList.add("selected");
    }
  }

  moveToNextMonth() {
    this.#calendarDate.month++;
    if (this.#calendarDate.month > 11) {
      this.#calendarDate.month = 0;
      this.#calendarDate.year++;
    }
    this.updateMonth();
    this.updateDates();
  }

  moveToPreviousMonth() {
    this.#calendarDate.month--;
    if (this.#calendarDate.month < 0) {
      this.#calendarDate.month = 11;
      this.#calendarDate.year--;
    }
    this.updateMonth();
    this.updateDates();
  }
}

new DatePicker();
