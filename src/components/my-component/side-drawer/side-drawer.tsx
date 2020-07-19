import { Component, h, Prop, State, Method } from "@stencil/core";


@Component({
    tag: 'dk-side-drawer',
    styleUrl: 'side-drawer.scss',
    shadow: true
})

export class SideDrawer {
    @State() showContactInfo: boolean = false;

    @Prop({ reflect: true }) drawerTitle: string;
    @Prop({ reflect: true, mutable: true }) opened: boolean;

    onCloseDrawer() {
        this.opened = false
    }

    onContentChange(content: string) {
        this.showContactInfo = (content == 'contact')
    }

    @Method()
    open() {
        this.opened = true;
    }

    render() {
        let mainContent = <solt />;
        if (this.showContactInfo) {
            mainContent = (
                <div id="contact-information">
                    <h2>Contact Information</h2>
                    <p>You can reach us via phone or email</p>
                    <ul>
                        <li>Phone: 555-555-5555</li>
                        <li>Email: something@somthing.com</li>
                    </ul>
                </div>
            );
        }

        return [
            <div class="backdrop" onClick={() => this.onCloseDrawer()}></div>,
            <aside>
                <header>
                    <h1>{this.drawerTitle}</h1>
                    <button onClick={() => this.onCloseDrawer()}>X</button>
                </header>
                <section id="tabs">
                    <button class={!this.showContactInfo ? 'active' : ''} onClick={this.onContentChange.bind(this, 'nav')}>Navigation</button>
                    <button class={this.showContactInfo ? 'active' : ''} onClick={this.onContentChange.bind(this, 'contact')}>Contact</button>
                </section>
                <main>
                    {mainContent}
                </main>
            </aside>
        ];
    }
}