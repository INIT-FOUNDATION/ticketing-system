import { Directive,ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';

@Directive({
  selector: '[appNegativezeroNotallowed]'
})
export class NegativezeroNotallowedDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    const regex = /^-0/g;
    if (initalValue.length === 2) {
      this.el.nativeElement.value = initalValue.replace(regex, '');
      event.stopPropagation();
      return false;
    }
    return true;
  }

}
