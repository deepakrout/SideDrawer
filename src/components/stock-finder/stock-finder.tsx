import { Component, h, State, Event, EventEmitter } from "@stencil/core";
import { AV_API_KEY } from '../../global/global'

@Component({
    tag: 'dk-stock-finder',
    styleUrl: 'stock-finder.scss',
    shadow: true
})
export class StockFinder {

    stockNameInput: HTMLInputElement;

    @State() searchResults: { symbol: string, name: string }[];
    @State() loading: boolean = false;

    @Event({ bubbles: true, composed: true }) dkSymbolSelected: EventEmitter<string>;

    onFindStock(event: Event) {
        event.preventDefault();
        //console.log(this.stockNameInput.value)
        this.loading = true;
        const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${this.stockNameInput.value}&apikey=${AV_API_KEY}`;
        fetch(url)
            .then(resp => resp.json())
            .then(parsedJson => {

                this.searchResults = parsedJson['bestMatches'].map(
                    (item) => {
                        //  console.log(item)
                        return {
                            symbol: item['1. symbol'],
                            name: item['2. name']
                        }
                    }

                );
                //console.log(this.searchResults)
                this.loading = false;
            })
            .catch(err => {
                console.log(err.message);
                this.loading = false;
            })

    }

    onSelectSymbol(symbol: string) {
        this.dkSymbolSelected.emit(symbol);
    }

    render() {
        let content = (
            <ul>
                {this.searchResults?.map(result =>
                    <li onClick={this.onSelectSymbol.bind(this, result.symbol)}>
                        <strong>{result.symbol}</strong>:&nbsp;{result.name}</li>
                )}
            </ul>
        )
        if (this.loading) {
            content = <dk-spinner></dk-spinner>
        }
        return [
            <form onSubmit={this.onFindStock.bind(this)}>
                <input id="stock-symbol"
                    ref={el => (this.stockNameInput = el)} />
                <button type="submit" >Find</button>
            </form>,
            <ul>
                {content}
            </ul>
        ]
    }
}