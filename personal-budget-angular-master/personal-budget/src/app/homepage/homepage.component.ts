import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { DataService } from '../data.service';
@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [
            "#98abd5", "#8a69a7", "#7b7888", "#6b486b", "#b05e56", "#d0743c", "#fffd00"
            ]
        }
    ],
    labels: []
};

  constructor(private http: HttpClient , private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.dataService.dataImport().subscribe((res: any) =>{
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
        this.createChart();
        // change(randomData());
      }
    });
  }
  createChart() {
    var ctx = document.getElementById('myChart');
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
  }

}
