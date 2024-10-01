import React, { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  theme?: string;
  interval?: string;
}

function TradingViewWidget({
  symbol = "BINANCE:BTCUSDT",
  interval = "D",
  theme = "light",
}: TradingViewWidgetProps) {
  const container = useRef();

  const fixedSymbol = symbol.replace("-", ":");
  console.log(fixedSymbol);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${fixedSymbol}",
          "interval": "${interval}",
          "timezone": "Asia/Kolkata",
          "theme": "${theme}",
          "style": "1",
          "locale": "en",
          "withdateranges": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
    container.current.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
