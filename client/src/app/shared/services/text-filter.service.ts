import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextFilterService {

    validateText(text: string): string {
        const RegExp = /[0-9]{5,}|[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+|@[a-zA-z]+|[a-zA-Z]+\.[a-zA-Z]+/
        /*
            [0-9]{5,} => 88005553535
            [a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+ => test@gmail.com
            @[a-zA-z]+ => @telegram
            [a-zA-Z]+\.[a-zA-Z]+ => site.com
        */
        return text.replace(RegExp, '')
    }
}