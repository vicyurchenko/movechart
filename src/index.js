class ScrollChart {
  static defaultOptions = {
    btnRadius: 15,
    angle: Math.PI / 180,
    borderClr: '#eeeeee',
    arrowClr: '#1c5e7d',
  };

  constructor(chart, options = {}) {
    this.chart = chart;
    this.options = { ...ScrollChart.defaultOptions, ...options };
  }

  drawBtn(isRight = false) {
    const {
      ctx,
      chartArea: { left, right, top, height },
    } = this.chart;
    const { btnRadius, angle, borderClr, arrowClr } = this.options;
    const side = isRight ? right : left;
    const pixel = btnRadius / (isRight ? -3 : 3);
    ctx.beginPath();
    ctx.strokeStyle = borderClr;
    ctx.fillStyle = 'white';
    ctx.arc(
      side,
      height / 2 + top,
      btnRadius,
      angle * 0,
      angle * 360,
      false
    );
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth = btnRadius / 5;
    ctx.strokeStyle = arrowClr;
    ctx.moveTo(side + pixel, height / 2 + top - btnRadius / 2);
    ctx.lineTo(side - pixel, height / 2 + top);
    ctx.lineTo(side + pixel, height / 2 + top + btnRadius / 2);
    ctx.stroke();
    ctx.closePath();
  }

  getHoveredButton(x, y) {
    const {
      chartArea: { left, right, top, height },
    } = this.chart;
    const { btnRadius } = this.options;
    const buttonTop = height / 2 + top - btnRadius;
    const buttonBottom = height / 2 + top + btnRadius;
    if (y >= buttonTop && y <= buttonBottom) {
      if (x >= right - btnRadius && x <= right + btnRadius) {
        return 1;
      }
      if (x >= left - btnRadius && x <= left + btnRadius) {
        return -1;
      }
    }
    return 0;
  }

  scroll(x, y) {
    const delta = this.getHoveredButton(x, y);
    const {
      config: { data, options },
    } = this.chart;
    const { scales } = options;
    const { x: xAxis } = scales;
    const numVisibleLabels = xAxis.max - xAxis.min;
    if (delta > 0) {
      if (xAxis.max >= data.labels.length - 1) {
        xAxis.max = data.labels.length - 1;
        xAxis.min = Math.max(xAxis.max - numVisibleLabels, 0);
      } else {
        xAxis.min += 1;
        xAxis.max += 1;
      }
    } else if (delta < 0) {
      if (xAxis.min <= 0) {
        xAxis.min = 0;
        xAxis.max = numVisibleLabels;
      } else {
        xAxis.min -= 1;
        xAxis.max -= 1;
      }
    }
    this.setCursorStyle(x, y);
    this.chart.update();
  }

  setCursorStyle(x, y) {
    const hoveredBtn = this.getHoveredButton(x, y);
    const isRightBtn = hoveredBtn === 1;
    const isHovering = hoveredBtn !== 0;
    const { config } = this.chart;
    const { options: { scales } } = config;
    const { x: xAxis } = scales;

    let style = isHovering ? 'pointer' : 'default';
    if (isHovering && (isRightBtn && xAxis.max >= config.data.labels.length - 1
      || !isRightBtn && xAxis.min <= 0)) {
      style = 'not-allowed';
    }
    this.chart.canvas.style.cursor = style;
  }
}

const moveChart = {
  id: 'moveChart',
  scrollChart: null,
  afterInit: function(chart, args, options) {
    this.scrollChart = new ScrollChart(chart, options);
    const canvas = chart.canvas;
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.scrollChart.scroll(x, y);
    });
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.scrollChart.setCursorStyle(x, y);
    })
  },
  afterDraw: function(chart) {
    if (this.scrollChart) {
      this.scrollChart.drawBtn();
      this.scrollChart.drawBtn(true);
    }
  },
  defaults: {
    btnRadius: 15,
    BorderClr: '#eeeeee',
    ArrowClr: '#1c5e7d',
  }
};

export default moveChart;