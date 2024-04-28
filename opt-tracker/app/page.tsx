"use client";
import { useState, useEffect } from "react";
import Table from "./components/Table";
import Chart from "./components/Chart";
import PriceSlider from "./components/Slider";

interface DataFromApi {
  stockData: string[];
}

export interface FinData {
  estimatedSalary: number;
  sharesOwned: number;
  sharesToBuy: number;
  priceToBuy: number;
  rsusOwned: number;
}

export interface GraphData {
  date: string;
  price: number;
}

const nodeBackend = "http://localhost:5000";

export default function Home() {
  const [data, setData] = useState<DataFromApi>({} as DataFromApi);
  const [finData, setFinData] = useState<FinData>({} as FinData);

  const date = new Date();
  const dummyStockData = ["0"];
  const dateString = `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getDate()}, ${date.getFullYear()}`;
  const lastIndex = data.stockData ? data.stockData.length - 1 : 0;
  const mostRecentStockData = data.stockData
    ? data.stockData[lastIndex]
    : dummyStockData;
  const stockPrice = parseFloat(mostRecentStockData[1]);
  const [updatedStockPrice, setUpdatedStockPrice] = useState(stockPrice);

  const graphData: GraphData[] = [];

  if (data.stockData) {
    data.stockData.map((entry) => {
      graphData.push({
        date: entry[0],
        price: parseFloat(entry[1]),
      });
    });
  }

  const createGraphDataObject = (graphData: GraphData[]) => {
    return {
      labels: graphData.map((data) => data.date),
      datasets: [
        {
          label: "RDDT Progress Over Time",
          data: graphData.map((data) => data.price),
        },
      ],
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(nodeBackend, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setData({ stockData: json.data.slice(1) });
          setFinData({
            estimatedSalary: json.finData.estimatedSalary,
            sharesOwned: json.finData.sharesOwned,
            sharesToBuy: json.finData.sharesToBuy,
            priceToBuy: json.finData.priceToBuy,
            rsusOwned: json.finData.rsusOwned,
          });
        });
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="top-container flex space-between">
        <div className="info-container">
          <div>Today's Date:</div>
          <div>{dateString}</div>
          <div>Current Share Price:</div>
          <div>{`$${stockPrice.toFixed(2)}`}</div>
          <div>15% Long Term Cap Gains Bracket: $47,026 – $518,900</div>
          <div>35% Single Current Tax Bracket: $243,726 to $609,350</div>
        </div>
        <Chart data={createGraphDataObject(graphData)} />
      </div>
      <PriceSlider />
      <Table finData={finData} stockPrice={stockPrice} />
    </>
  );
}
