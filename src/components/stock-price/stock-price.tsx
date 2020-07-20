import { Component, h, State, Element, Prop, Watch, Listen } from "@stencil/core";
import { AV_API_KEY } from '../../global/global';

@Component({
    tag: 'dk-stock-price',
    styleUrl: 'stock-price.scss',
    shadow: true
})
export class StockPrice {
    @Element() el: HTMLElement;
    stockInput: HTMLInputElement;

    @State() fetchedPrice: string;
    @State() stockUserInput: string;
    @State() stockInputValid = false;
    @State() errorMessage: string;
    @State() loading: boolean = false;

    @Prop({ mutable: true, reflect: true }) stockSymbol: string;


    @Watch('stockSymbol')
    stockSymbolChanged(newValue: string, oldValue: string) {
        if (newValue !== oldValue) {
            this.stockUserInput = newValue;
            this.fetchStockPrice(newValue);
        }
    }

    onUserInput(event: Event) {
        this.stockUserInput = (event.target as HTMLInputElement).value;
        if (this.stockUserInput.trim() !== '') {
            this.stockInputValid = true;
        } else {
            this.stockInputValid = false;
        }
    }

    @Listen('dkSymbolSelected', { target: 'body' })
    onStockSymbolSelected(event: CustomEvent) {
        if (event.detail && event.detail !== this.stockSymbol) {
            this.stockSymbol = event.detail;
            this.stockInputValid = true;
            //this.fetchStockPrice(event.detail);
        }
    }

    onFetchStockPrice(event: Event) {
        event.preventDefault();
        //console.log(this.el.shadowRoot.getElementById('stock-symbol'));
        //const stockSymbol = (this.el.shadowRoot.getElementById('stock-symbol') as HTMLInputElement).value
        //const stockSymbol = this.stockInput.value
        //console.log(`stockSymbol ${stockSymbol}`)
        //console.log('Submitted');
        this.stockSymbol = this.stockInput.value;
        //this.fetchStockPrice(stockSymbol);
    }

    private fetchStockPrice(stockSymbol: string) {
        this.loading = true;
        let url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`;
        fetch(url)
            .then(data => { return data.json(); })
            .then(parsedJson => {
                //console.log(parsedJson, parsedJson["Global Quote"])
                this.fetchedPrice = `$${parsedJson["Global Quote"]['05. price']}`;
                this.loading = false;
            }
            )
            .catch(err => {
                console.log(err);
                this.errorMessage = err.message;
                this.loading = false;
            });
    }
    componentWillLoad() {
        //console.log(`componentWillLoad...`, this.stockSymbol)
        if (this.stockSymbol) {
            this.stockUserInput = this.stockSymbol;
            this.stockInputValid = true;
            this.errorMessage = null;

        }
    }

    componentDidLoad() {
        //console.log(`componentDidLoad...`)
        if (this.stockSymbol) {
            //this.stockUserInput = this.stockSymbol;
            this.fetchStockPrice(this.stockSymbol);
        }
    }

    componentWillUpdate() {
        //console.log(`componentWillUpdate...`);
    }

    componentDidUpdate() {
        //console.log(`componentDidUpdate...`);
    }

    hostData() {
        return{ class: this.errorMessage ? 'error' : '' };
    }

    render() {
        let dataContent = <p>Please Enter a Symbol</p>;
        if (this.errorMessage) {
            dataContent = <p>{this.errorMessage}</p>;
        }
        if (this.fetchedPrice) {
            dataContent = <p>Price: {this.fetchedPrice}</p>;
        }
        if (this.loading) {
          dataContent =  <dk-spinner></dk-spinner>
        }
        return [
            <form onSubmit={this.onFetchStockPrice.bind(this)}>
                <input id="stock-symbol" ref={el => this.stockInput = el}
                    value={this.stockUserInput}
                    onInput={this.onUserInput.bind(this)}
                />
                <button type="submit" disabled={!this.stockInputValid || this.loading}>Fetch</button>
            </form>,
            <div>
                {dataContent}
            </div>
        ]
    }
}
