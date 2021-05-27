import { Component, AfterViewInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss']
})
export class DonutComponent  implements AfterViewInit {

  public data = [];
  private svg;
  private margin = 50;
  private width = 750;
  private height = 600;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private color;

  constructor(private http: HttpClient , private dataService: DataService) { }

  ngAfterViewInit(): void {

    this.dataService.dataImport().subscribe(res => {

      this.data = res.myBudget;
      console.log(this.data);

      this.createSvg();
      this.createColors();
      this.drawChart();
    })


  }


  private createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );
}

private createColors(): void {
  this.color = d3.scaleOrdinal()
  .domain(this.data.map(d => d.budget))
  .range(["#66abc5", "#8a79a6", "#7b6888", "#6b586b", "#a05d56", "#d0743c", "#ff8c00"]);
}


private drawChart(): void {

  const pie = d3.pie<any>().value((d: any) => Number(d.budget));

  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(100)
    .outerRadius(this.radius)
  )
  .attr('fill', (d, i) => (this.color(i)))
  .attr('stroke', '#122226')
  .style('stroke-width', '1px');

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(110)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('text')
  .text(d => d.data.title)
  .attr('transform', d => 'translate(' + labelLocation.centroid(d) + ')')
  .style('text-anchor', 'middle')
  .style('font-size', 15);
}

}
