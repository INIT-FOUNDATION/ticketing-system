import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appFourNumber]'
})
export class FourNumberDirective {
  private prevVal: any;
  constructor(private el: ElementRef) {}

  // @HostListener('keydown', ['$event']) onKeyDown(event) {
  //   const e = event as KeyboardEvent;
  //   const initalValue = this.el.nativeElement.value;

  //   console.log(e.key, `@${initalValue}#`, '$$$$$12$', e.keyCode);
  //   if ((initalValue === '' && e.keyCode === 96) || (initalValue === '' && e.keyCode === 229)) {
  //     console.log('IN 1st if')
  //     this.el.nativeElement.value = '';
  //     e.preventDefault();
  //     return false;
  //   }
  //   console.log('testVa', (/^((?!(0))[0-9]{10})$/.test(initalValue)));
  //   if ((/^((?!(0))[0-9]{10})$/.test(initalValue)) && e.keyCode !== 8 && e.keyCode !== 46) {
  //     e.preventDefault();
  //     return;
  //   } else {

  //   }
  // }



  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initalValue = this.el.nativeElement.value;
    const c = initalValue.replace(/^([0-9]{0,4})$/g, '');
    this.el.nativeElement.value = initalValue.substr(0, 4);
    if (c.length > 1 && initalValue.length > 4) {
      if (this.prevVal) {
        this.el.nativeElement.value = this.prevVal;
      } else {
        this.prevVal = this.el.nativeElement.value;
      }
    }
    if (!(/^([0-9]{0,4})$/.test(initalValue))) {
      if (c.length > 1 && /^(?:0|00)\d+$/.test(c)) {
        this.el.nativeElement.value = initalValue.substr(1, c.length);
        this.el.nativeElement.type = 'text';
        this.el.nativeElement.setSelectionRange(0, 0);
        this.el.nativeElement.type = 'number';
        // setSelectionRange
      } else if ((initalValue).length === 1) {
        this.el.nativeElement.value = '';
      }
      event.stopPropagation();
      return false;
    } else {
      this.prevVal = this.el.nativeElement.value;
    }

  }
}


