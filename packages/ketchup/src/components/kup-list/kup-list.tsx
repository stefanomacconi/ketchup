import {
    Component,
    Event,
    EventEmitter,
    Element,
    Host,
    h,
    Prop,
} from '@stencil/core';

import { MDCList } from '@material/list';
import { MDCRipple } from '@material/ripple';
import { ComponentListElement } from './kup-list-declarations';
import { KupRadio } from '../kup-radio/kup-radio';
import { KupCheckbox } from '../kup-checkbox/kup-checkbox';
import { ItemsDisplayMode } from './kup-list-declarations';

@Component({
    tag: 'kup-list',
    styleUrl: 'kup-list.scss',
    shadow: true,
})
export class KupList {
    /**
     * Following default props and elements common to all widgets
     */
    @Element() rootElement: HTMLElement;

    @Prop() data: ComponentListElement[] = [];

    private filteredItems: ComponentListElement[] = [];
    private listComponent: MDCList = null;

    private radios: KupRadio[] = [];
    private checkboxes: KupCheckbox[] = [];

    //---- Internal state ----
    // Keeps string for filtering elements when filter mode is active
    @Prop() filter: string = '';

    // false - items non selezionabili
    // true  - items selezionabili
    @Prop({ reflect: true }) selectable: boolean = true;

    @Prop({ reflect: true }) fieldId: string = 'list-id';

    @Prop({ reflect: true }) twoLine: boolean = false;

    @Prop({ reflect: true }) roleType?: string = KupList.ROLE_LISTBOX;

    static ROLE_LISTBOX: string = 'listbox';
    static ROLE_RADIOGROUP: string = 'radiogroup';
    static ROLE_CHECKBOX: string = 'group';

    /**
     * Selects how the items must display their label and how they can be filtered for
     */
    @Prop({ reflect: true }) displayMode: ItemsDisplayMode =
        ItemsDisplayMode.DESCRIPTION;

    /**
     * Events.
     */

    @Event({
        eventName: 'kupListBlur',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupBlur: EventEmitter<{
        selected: ComponentListElement;
        el: EventTarget;
    }>;

    @Event({
        eventName: 'kupListChange',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupChange: EventEmitter<{
        selected: ComponentListElement;
        el: EventTarget;
    }>;

    @Event({
        eventName: 'kupListClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<{
        selected: ComponentListElement;
        el: EventTarget;
    }>;

    @Event({
        eventName: 'kupListFocus',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFocus: EventEmitter<{
        selected: ComponentListElement;
        el: EventTarget;
    }>;

    @Event({
        eventName: 'kupListInput',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupInput: EventEmitter<{
        selected: ComponentListElement;
        el: EventTarget;
    }>;

    /**
     * --- Methods ----
     */

    onKupBlur(e: CustomEvent, item: ComponentListElement) {
        this.log('onKupBlur', '');
        this.kupBlur.emit({
            selected: item,
            el: e.target,
        });
    }

    onKupChange(e: CustomEvent, item: ComponentListElement) {
        this.log('onKupChange', '');
        this.kupChange.emit({
            selected: item,
            el: e.target,
        });
    }

    onKupClick(
        e: CustomEvent & { target: HTMLLIElement },
        item: ComponentListElement,
        index: number
    ) {
        this.log('onKupClick', '');
        const { target } = e;
        if (this.isMultiSelection()) {
            if (item.selected == true) {
                this.setUnselected(item, index);
            } else {
                this.setSelected(item, index);
            }
        }
        if (this.isSingleSelection()) {
            if (item.selected != true) {
                let index1 = 0;
                this.filteredItems.map((item1) => {
                    this.setUnselected(item1, index1++);
                });
                this.setSelected(item, index);
            }
        }

        this.kupClick.emit({
            selected: item,
            el: target,
        });
    }

    onKupFocus(e: CustomEvent, item: ComponentListElement) {
        this.log('onKupFocus', '');
        this.kupFocus.emit({
            selected: item,
            el: e.target,
        });
    }

    onKupInput(e: CustomEvent, item: ComponentListElement) {
        this.log('onKupInput', '');
        this.kupInput.emit({
            selected: item,
            el: e.target,
        });
    }

    renderSeparator() {
        return <li role="separator" class="mdc-list-divider"></li>;
    }

    renderListItem(item: ComponentListElement, index: number) {
        this.filteredItems[index] = item;

        this.log('renderListItem', 'item: ' + JSON.stringify(item));
        if (item.selected != true) {
            item.selected = false;
        }

        let primaryTextTag = [item.value];
        if (this.displayMode == ItemsDisplayMode.CODE) {
            primaryTextTag = [item.value];
        }
        if (this.displayMode == ItemsDisplayMode.DESCRIPTION) {
            primaryTextTag = [item.text];
        }
        if (this.displayMode == ItemsDisplayMode.DESCRIPTION_AND_CODE) {
            primaryTextTag = [item.value + ' - ' + item.text];
        }
        let secTextTag = [];
        if (item.secondaryText && item.secondaryText != '') {
            primaryTextTag = [
                <span class="mdc-list-item__primary-text">{item.text}</span>,
            ];
            secTextTag = [
                <span class="mdc-list-item__secondary-text">
                    {item.secondaryText}
                </span>,
            ];
        }
        let classAttr = 'mdc-list-item';
        let tabIndexAttr = item.selected == true ? '0' : '-1';
        if (item.selected == true && this.isListBoxRule()) {
            classAttr += ' mdc-list-item--selected';
        }
        let roleAttr = 'option';

        let ariaCheckedAttr: string = null;
        let ariaSelectedAttr: string = item.selected == true ? 'true' : 'false';
        if (this.selectable != true) {
            ariaSelectedAttr = null;
        }
        let innerSpanTag = [
            <span class="mdc-list-item__text">
                {primaryTextTag}
                {secTextTag}
            </span>,
        ];
        if (this.isRadioButtonRule()) {
            roleAttr = 'radio';
            ariaCheckedAttr = item.selected == true ? 'true' : 'false';
            let dataTmp = [
                {
                    value: item.value,
                    label: '',
                    checked: item.selected == true ? true : false,
                },
            ];
            let aaa = {
                display: 'none',
            };
            innerSpanTag = [
                <span class="mdc-list-item__graphic">
                    <input type="radio" style={aaa} />
                    <kup-radio
                        name={this.fieldId + 'radio'}
                        data={dataTmp}
                        id={this.fieldId + index}
                        ref={(el) => (this.radios[index] = el as any)}
                    ></kup-radio>
                </span>,
                <label
                    class="mdc-list-item__text"
                    htmlFor={this.fieldId + index}
                >
                    {primaryTextTag}
                    {secTextTag}
                </label>,
            ];
        } else if (this.isCheckBoxRule()) {
            roleAttr = 'checkbox';
            ariaCheckedAttr = item.selected == true ? 'true' : 'false';
            let checkedAttr: boolean = item.selected == true ? true : false;

            let aaa = {
                display: 'none',
            };

            innerSpanTag = [
                <span class="mdc-list-item__graphic">
                    <input type="checkbox" style={aaa} />
                    <kup-checkbox
                        class="mdc-checkbox"
                        id={this.fieldId + index}
                        checked={checkedAttr}
                        ref={(el) => (this.checkboxes[index] = el as any)}
                    ></kup-checkbox>
                </span>,
                <label
                    class="mdc-list-item__text"
                    htmlFor={this.fieldId + index}
                >
                    {primaryTextTag}
                    {secTextTag}
                </label>,
            ];
        }
        return (
            <li
                class={classAttr}
                role={roleAttr}
                tabindex={tabIndexAttr}
                data-value={item.value}
                aria-selected={ariaSelectedAttr}
                aria-checked={ariaCheckedAttr}
                onClick={
                    !this.selectable
                        ? (e: any) => e.stopPropagation()
                        : (e: any) => this.onKupClick(e, item, index)
                }
            >
                {innerSpanTag}
            </li>
        );
    }

    setUnselected(item: ComponentListElement, index: number) {
        item.selected = false;
        let target = this.listComponent.listElements[index];
        target.setAttribute('aria-selected', 'false');
        target.setAttribute('aria-checked', 'false');
        target.setAttribute('tabindex', '-1');
        if (this.isListBoxRule()) {
            target.setAttribute('class', 'mdc-list-item');
        }

        this.sendInfoToSubComponent(index, item);
    }

    setSelected(item: ComponentListElement, index: number) {
        item.selected = true;
        let target = this.listComponent.listElements[index];
        target.setAttribute('aria-selected', 'true');
        target.setAttribute('aria-checked', 'true');
        target.setAttribute('tabindex', '0');
        if (this.isListBoxRule()) {
            target.setAttribute(
                'class',
                'mdc-list-item' + ' ' + 'mdc-list-item--selected'
            );
        }

        this.sendInfoToSubComponent(index, item);
    }

    sendInfoToSubComponent(index: number, item: ComponentListElement) {
        if (this.isRadioButtonRule()) {
            let dataTmp = [
                {
                    value: item.value,
                    label: '',
                    checked: item.selected == true ? true : false,
                },
            ];
            this.radios[index].data = dataTmp;
        }
        if (this.isCheckBoxRule()) {
            this.checkboxes[index].checked = item.selected;
        }
    }

    getLiIndexElementForValue(key: string): number {
        let index = -1;
        let i = 0;
        this.filteredItems.forEach((item) => {
            if (item.isSeparator != true) {
                if (item.value == key) {
                    index = i;
                }
            }
            i++;
        });

        return index;
    }

    isSingleSelection(): boolean {
        return this.isRadioButtonRule() || this.isListBoxRule();
    }

    isMultiSelection(): boolean {
        return this.isCheckBoxRule();
    }

    isCheckBoxRule(): boolean {
        return this.roleType == KupList.ROLE_CHECKBOX;
    }

    isRadioButtonRule(): boolean {
        return this.roleType == KupList.ROLE_RADIOGROUP;
    }

    isListBoxRule(): boolean {
        return this.roleType == KupList.ROLE_LISTBOX;
    }

    checkRoleType() {
        if (!this.isCheckBoxRule() && !this.isRadioButtonRule()) {
            this.roleType = KupList.ROLE_LISTBOX;
        }
    }

    //---- Lifecycle hooks ----

    componentDidLoad() {
        this.listComponent = null;
        // Called once just after the component fully loaded and the first render() occurs.
        const root = this.rootElement.shadowRoot;
        if (root != null) {
            // Material design javascript initialization
            // Refer to: https://material.io/develop/web/components and choose your component
            this.listComponent = MDCList.attachTo(
                root.querySelector('.mdc-list') // Use your widget selector
            );

            this.listComponent.singleSelection = this.isSingleSelection();

            this.listComponent.listElements.map(
                (listItemEl: any) => new MDCRipple(listItemEl)
            );
        }
    }

    itemComplient(item: ComponentListElement): boolean {
        if (item.isSeparator) {
            return true;
        }
        if (!this.filter) {
            return true;
        }

        if (this.displayMode == ItemsDisplayMode.CODE) {
            return (
                item.value.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0
            );
        }
        if (this.displayMode == ItemsDisplayMode.DESCRIPTION) {
            return (
                item.text.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0
            );
        }

        return (
            item.value.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0 ||
            item.text.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0
        );
    }

    log(methodName: string, msg: string) {
        console.log(
            'kup-list.' + methodName + '() ' + this.fieldId + ' - ' + msg
        );
    }

    render() {
        this.checkRoleType();
        this.log('render', 'selectable: ' + this.selectable);

        //---- Rendering ----
        let componentClass: string = 'mdc-list';
        if (this.selectable != true) {
            componentClass += ' mdc-list--non-interactive';
        }
        if (this.twoLine) {
            componentClass += ' mdc-list--two-line';
        }
        let roleAttr = this.roleType;

        let ariaMultiSelectable: string = 'false';
        if (this.isMultiSelection()) {
            ariaMultiSelectable = 'true';
        }

        this.filteredItems = [];
        this.radios = [];
        this.checkboxes = [];
        let index = 0;
        // Host refers to container DOM element - kup-list
        return (
            <Host>
                <div id="kup-component">
                    <ul
                        class={componentClass}
                        role={roleAttr}
                        id={this.fieldId}
                        aria-multiselectable={ariaMultiSelectable}
                    >
                        {this.data
                            .filter((item) => this.itemComplient(item))
                            .map((item) =>
                                item.isSeparator
                                    ? this.renderSeparator()
                                    : this.renderListItem(item, index++)
                            )}
                    </ul>
                </div>
            </Host>
        );
    }
}
