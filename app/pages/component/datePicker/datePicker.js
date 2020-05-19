
function getDays(year, month) {
  const days = [];
  month = parseInt(month, 10);
  const date = new Date(year, month, 0);
  const maxDay = date.getDate();
  for (let i = 1; i <= maxDay; i++) {
    let day = 0;
    day = i < 10 ? '0' + i : i;
    days.push(day);
  }
  return days;
}
/**
 * 初始化年月日
 */
const date = new Date();
const years = [];
const months = [];

let tempYearPos = [0];
let days = [];

for (let i = 1900; i <= date.getFullYear(); i++) {
  years.push(i);
  tempYearPos = [i - 1900]
}

for (let i = 1; i <= 12; i++) {
  let month = 0;
  month = i < 10 ? '0' + i : i;
  months.push(month);
}

days = getDays(date.getFullYear(), date.getMonth() + 1);

Component({
  options: {
    styleIsolation: 'apply-shared'   // 页面 wxss 样式将影响到自定义组件
  },

  properties: {
    pickerClass:  {   // picker 样式类名
      type: String,
      value: ''
    },
    pickerItemStyle: { // picker-view样式
      type: String,
      value: ''
    },
    pickerItemClass: { // picker-view样式类名
      type: String,
      value: ''
    },
    indicatorStyle: {  // 选择器中间选中框的样式
      type: String,
      value: ''
    },
    indicatorClass: {  // 选择器中间选中框的样式类名
      type: String,
      value: ''
    },
    viewStyle: {      // 选择框的样式
      type: String,
      value: ''
    },
    viewClass: {      // 选择框的样式类名
      type: String,
      value: ''
    },
    selectedStyle: {  // 选择被选中时的样式
      type: String,
      value: ''
    },
    selectedClass: {  // 选择被选中时的样式类名
      type: String,
      value: ''
    },
    yearsClass: {     // 年选择框的样式类名
      type: String,
      value: ''
    },
    monthsClass: {    // 月选择框的样式类名
      type: String,
      value: ''
    },
    daysClass: {      // 日选择框的样式类名
      type: String,
      value: ''
    }
  },

  data: {
    years: years,
    months: months,
    days: days,
    tempYearPos: tempYearPos,
    tempMonthPos: [0],
    tempDayPos: [0],
    showPicker: false
  },

  attached: function() {
    this.passValue()
  },

  methods: {
    passValue(e) {
      const curYear = this.data.years[this.data.tempYearPos];
      const curMonth = this.data.months[this.data.tempMonthPos];
      const curDay = this.data.days[this.data.tempDayPos];
      const value = [curYear, curMonth, curDay];
      this.triggerEvent('getValue', {
        value: value,
      });
    },
    year_onChange: function(e) {
      //年改变，月要滑到一月，天要重新计算该年该月多少天
      let days = [];
      const curYear = this.data.years[e.detail.value];
      days = getDays(curYear, 1);
      this.setData({
        days: days,
        tempYearPos: e.detail.value,
        tempMonthPos: [0],
        tempDayPos: [0],
      }, () => {
        this.passValue()
      });
    },
    month_onChange: function(e) {
      let days = [];
      const curYear = this.data.years[this.data.tempYearPos];
      const curMonth = this.data.months[e.detail.value];
      days = getDays(curYear, curMonth);
      this.setData({
        days: days,
        tempMonthPos: e.detail.value,
        tempDayPos: [0],
      }, () => {
        this.passValue()
      });
    },
    day_onChange: function(e) {
      this.setData({
        tempDayPos: e.detail.value
      }, () => {
        this.passValue()
      });
    },
  }
});