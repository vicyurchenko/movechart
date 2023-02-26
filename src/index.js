class ScrollChart {
  constructor(chart) {
    this.chart = chart;
  }

  draw(pixel, isRight = false) {
    const {ctx, chartArea : { left, right, top, height }} = this.chart;

    const side = isRight ? right : left;
    const angle = Math.PI / 180;

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f7f7f7';
    ctx.fillStyle = 'white';
    ctx.arc(side, height / 2 + top, 15, angle * 0, angle * 360, false);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1c5e7d';
    ctx.moveTo(side + pixel, height / 2 + top - 7.5);
    ctx.lineTo(side - pixel, height / 2 + top);
    ctx.lineTo(side + pixel, height / 2 + top + 7.5);
    ctx.stroke();
    ctx.closePath();
  }

  getHoveredButton(x, y) {
    const { chartArea : { left, right, top, height } } = this.chart;

    const buttonTop = height / 2 + top - 15;
    const buttonBottom = height / 2 + top + 15;

    if (y >= buttonTop && y <= buttonBottom) {
      if (x >= right - 15 && x <= right + 15) {
        return 1;
      }
      if (x >= left - 15 && x <= left + 15) {
        return -1;
      }
    }
    return 0;
  }

  scroll(x, y) {
    const delta = this.getHoveredButton(x, y);
    const { config } = this.chart;
    const { options: { scales } } = config;
    const { x: xAxis } = scales;
    const numVisibleLabels = xAxis.max - xAxis.min;

    if (delta > 0) {
      if (xAxis.max >= config.data.labels.length - 1) {
        xAxis.max = config.data.labels.length - 1;
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
    this.chart.update();
  }

  setCoursorStyle({ x, y }) {
    const isHovering = this.getHoveredButton(x, y) !== 0;
    this.chart.canvas.style.cursor = isHovering ? 'pointer' : 'default';
  }
}

const moveChart = {
  id: 'moveChart',
  scrollChart: null,

  afterInit: function(chart) {
    const { canvas } = chart;
    this.scrollChart = new ScrollChart(chart);
    canvas?.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.scrollChart.scroll(x, y);
    });
    canvas?.addEventListener('mouseenter', () => {
      canvas.addEventListener('mousemove', this.mousemoveHandler.bind(this));
    });
    canvas?.addEventListener('mouseleave', () => {
      canvas.removeEventListener('mousemove', this.mousemoveHandler.bind(this));
    });
  },

  mousemoveHandler: function(event) {
    this.scrollChart.setCoursorStyle(event);
  },

  afterDraw: function(chart) {
    if (!this.scrollChart) {
      const scrollChart = new ScrollChart(chart);
      this.scrollChart = scrollChart;
    }
    this.scrollChart.draw(5);
    this.scrollChart.draw(-5, true);
  },
};

export default moveChart;