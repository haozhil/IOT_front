<template>
  <div>
    <!-- ECharts 图表容器 -->
    <div ref="chart" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    dataRecords1: {
      type: Object,
      required: true,
      default: () => ({
        lastTimeTaken: [],
        RemainQuantity: [],
      }),
      trigger: {
        type: Number,
        required: true,
      },
    },
  },
  watch: {
    trigger: {
      handler(newValue) {
        this.updateChart(); // 当 dataRecords1 数据变化时更新图表
        console.log(newValue);
      },
      immediate: true, // 在组件加载时立即执行一次
    },
  },
  mounted() {
    this.initChart(); // 初始化图表
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart); // 初始化 ECharts 实例
      this.updateChart(); // 初始加载数据
    },
    updateChart() {
      const myChart = this.chart;

      // 防御性检查，确保数据存在
      if (
        !this.dataRecords1.lastTimeTaken ||
        !this.dataRecords1.RemainQuantity
      ) {
        console.error("数据未定义");
        return;
      }

      const times = this.dataRecords1.lastTimeTaken;
      const quantities = this.dataRecords1.RemainQuantity;

      // 检查数据是否为空
      if (times.length === 0 || quantities.length === 0) {
        console.warn("数据为空，不更新图表");
        return;
      }

      console.log(this.dataRecords1.lastTimeTaken);

      // 设置图表选项
      myChart.setOption({
        title: {
          text: "动态剩余量折线图",
        },
        tooltip: {},
        legend: {
          data: ["剩余量"],
        },
        xAxis: {
          data: times, // X 轴数据：时间
        },
        yAxis: {},
        series: [
          {
            name: "剩余量",
            type: "bar", // 柱状图
            data: quantities, // Y 轴数据：剩余量
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
#chart {
  margin: 0 auto;
}
</style>
