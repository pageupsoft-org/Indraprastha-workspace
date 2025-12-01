import { Component, OnInit, ViewChild } from '@angular/core';
import { DaterangPicker } from "../../component/daterang-picker/daterang-picker";
import { IDateRange } from '../../component/daterang-picker/daterange.model';
import { Base } from '@portal/core';
import { ApiRoutes } from '@shared';
import { IGenericResponse } from '../../core/interface/response/genericResponse';
import { IDashboardResponse, TotalPendings } from '../../core/interface/response/dashboard.response';
import { CommonModule } from '@angular/common';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

export type pieOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
}

export type pieOption = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard extends Base implements OnInit {
  public totalPendingOrders : TotalPendings = {
    totalOrder : 0,
    order : 0,
    newCustomer : 0
  }
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("pie") pie: ChartComponent | undefined;
  public pieOptions: Partial<pieOptions>;

  constructor() {
    super()
    this.chartOptions = {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };

    this.pieOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: "donut"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  
  }


  ngOnInit(): void {
    this.getDashboardData()
  }

  public payload: IDateRange = {
    startDate: null,
    endDate: null
  }

  public onChangeDate(data: IDateRange) {
    if (data) {
      this.payload.startDate = data.startDate
      this.payload.endDate = data.endDate
      this.getDashboardData();
    }
  }

  private getDashboardData() {
    this.httpPostPromise<IGenericResponse<IDashboardResponse>, IDateRange>(ApiRoutes.DASHBOARD.BASE, this.payload)
      .then(response => {
        if (!response || !response.data) return;
        // keep total pending if needed
        this.totalPendingOrders = response.data.totalPendings;
        
        const yearly = response.data.yearlyOrders;
        // month labels
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // prepare series array for apex: [{ name: 'Placed', data: [..12 numbers..] }, ...]
        const series: { name: string, data: number[] }[] = [];

        if (Array.isArray(yearly) && yearly.length) {
          yearly.forEach((statusObj: any) => {
            const name = statusObj.orderStatus ?? 'Unknown';
            const counts = new Array(12).fill(0);

            if (Array.isArray(statusObj.orderCount)) {
              statusObj.orderCount.forEach((m: any) => {
                // if your API month is 1..12 change to (m.month - 1)
                const idx = Number(m.month) || 0;
                // guard: clamp idx to 0..11
                const clampedIdx = Math.max(0, Math.min(11, idx));
                counts[clampedIdx] = Number(m.count) || 0;
              });
            }

            series.push({ name, data: counts });
          });
        } else {
          // fallback: no data, show zeroes for a single series
          series.push({ name: 'Orders', data: new Array(12).fill(0) });
        }

        // ensure xaxis contains month labels
        const xaxis = {
          type: 'category',
          categories: monthLabels
        } as any;

        // update chart safely: prefer instance method
        if (this.chart && typeof this.chart.updateSeries === 'function') {
          // update series (you can also update categories via updateOptions)
          this.chart.updateSeries(series as any, true);
          // update categories too (instance-level)
          if (typeof (this.chart as any).updateOptions === 'function') {
            (this.chart as any).updateOptions({ xaxis }, true);
          } else {
            // fallback update options via chartOptions object
            this.chartOptions = { ...this.chartOptions, xaxis, series } as any;
          }
        } else {
          // component not initialized yet — update options object
          this.chartOptions = { ...this.chartOptions, series, xaxis } as any;
        }
      })
      .catch(error => {
        // optional: show fallback series
        const fallback = [{ name: 'Orders', data: new Array(12).fill(0) }];
        this.chartOptions = { ...this.chartOptions, series: fallback } as any;
      });
  }


}

