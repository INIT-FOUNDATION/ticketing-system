import { HostListener } from '@angular/core';
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appZeroNotallowed]'
})
export class ZeroNotallowedDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initalValue = this.el.nativeElement.value;
    const regex = /^0/g;
    if (initalValue.length === 1) {
      this.el.nativeElement.value = initalValue.replace(regex, '');
      event.stopPropagation();
      return false;
    }
    return true;
  }

}
