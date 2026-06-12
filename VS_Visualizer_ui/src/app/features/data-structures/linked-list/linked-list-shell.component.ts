import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { VisualizationService } from '../../../core/services/visualization.service';
import { ControlPanelComponent } from '../../../shared/components/control-panel/control-panel.component';
import { StepExplanationComponent } from '../../../shared/components/step-explanation/step-explanation.component';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { LinkedListApiService, AlgorithmResponse } from './services/linked-list-api.service';
import { LinkedListLayoutService, LinkedListType } from './services/linked-list-layout.service';
import { NormalLinkedListVisualizerComponent } from './visualizers/normal-linked-list-visualizer.component';
import { CircularLinkedListVisualizerComponent } from './visualizers/circular-linked-list-visualizer.component';
import { DoublyLinkedListVisualizerComponent } from './visualizers/doubly-linked-list-visualizer.component';
import { DoublyCircularLinkedListVisualizerComponent } from './visualizers/doubly-circular-linked-list-visualizer.component';

@Component({
  selector: 'app-linked-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatRadioModule,
    ControlPanelComponent,
    StepExplanationComponent,
    TranslateModule,
    NormalLinkedListVisualizerComponent,
    CircularLinkedListVisualizerComponent,
    DoublyLinkedListVisualizerComponent,
    DoublyCircularLinkedListVisualizerComponent,
  ],
  templateUrl: './linked-list-shell.component.html',
  styleUrl: './linked-list-shell.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LinkedListShellComponent {
  private apiService = inject(LinkedListApiService);
  visualizationService = inject(VisualizationService);
  languageService = inject(LanguageService);
  readonly layoutService = inject(LinkedListLayoutService);
  isTableShown = signal(false);

  generateCount: number = 10;
  _decimalCount: number = 0;
  minValue: number = -1000;
  maxValue: number = 1000;

  get decimalCount(): number {
    if (this.selectedType === 'int' || this.selectedType === 'char') {
      return 0;
    }
    return this._decimalCount;
  }

  set decimalCount(value: number) {
    this._decimalCount = value;
  }

  countHintText = [
    '• Number of values to generate',
    '• Min: 2, Max: 100',
    '• Must be a positive integer',
  ].join('\n');

  decimalsHintText = [
    '• Decimal places for generated numbers',
    '• 0 = all integers',
    '• 1-5 = all decimals with exact number of decimal places',
    '• Min: 0, Max: 5',
  ].join('\n');

  minValueHintText = [
    '• Minimum value of generated numbers',
    '• Range: -1000000 to 1000000',
    '• Must be less than Max Value',
  ].join('\n');

  maxValueHintText = [
    '• Maximum value of generated numbers',
    '• Range: -1000000 to 1000000',
    '• Must be greater than Min Value',
  ].join('\n');

  hintText = [
    'Input format:',
    'Comma-separated',
    '2 to 100 numbers only',
    'Values: -1000000 to 1000000',
    'Up to 5 decimal places',
  ].join('\n');

  arrayInput = '';
  selectedOperation = 'access';
  currentOperation = 'access';
  indexInput = '';
  valueInput = '';
  isLoading = false;
  errorMessage = '';
  currentArray: (number | string)[] = [];

  selectedLinkedListType: LinkedListType = 'normal';

  get isDoubly(): boolean {
    return this.selectedLinkedListType === 'doubly' || this.selectedLinkedListType === 'doubly-circular';
  }

  get isCircular(): boolean {
    return this.selectedLinkedListType === 'circular' || this.selectedLinkedListType === 'doubly-circular';
  }

  toggleDoubly() {
    if (this.selectedLinkedListType === 'doubly') {
      this.selectedLinkedListType = 'normal';
    } else if (this.selectedLinkedListType === 'doubly-circular') {
      this.selectedLinkedListType = 'circular';
    } else if (this.selectedLinkedListType === 'normal') {
      this.selectedLinkedListType = 'doubly';
    } else {
      this.selectedLinkedListType = 'doubly-circular';
    }
  }

  toggleCircular() {
    if (this.selectedLinkedListType === 'circular') {
      this.selectedLinkedListType = 'normal';
    } else if (this.selectedLinkedListType === 'doubly-circular') {
      this.selectedLinkedListType = 'doubly';
    } else if (this.selectedLinkedListType === 'normal') {
      this.selectedLinkedListType = 'circular';
    } else {
      this.selectedLinkedListType = 'doubly-circular';
    }
  }

  operations = [
    { value: 'access', label: 'Access by Index' },
    { value: 'update', label: 'Update Value' },
    { value: 'insert-head', label: 'Insert at Head' },
    { value: 'insert-tail', label: 'Insert at Tail' },
    { value: 'insert-position', label: 'Insert at Position' },
    { value: 'delete-head', label: 'Delete at Head' },
    { value: 'delete-tail', label: 'Delete at Tail' },
    { value: 'delete-position', label: 'Delete at Position' },
    { value: 'search', label: 'Search for Value' },
    { value: 'traverse', label: 'Traverse' },
  ];

  typeOptions = [
    { value: 'char', label: 'Char' },
    { value: 'int', label: 'Integer' },
    { value: 'float', label: 'Float' },
  ];

  selectedType = 'int';
  baseAddress: string = '';
  showHintPopup = false;

  memoryHintText = [
    '📐 Memory Address Formula:',
    'address = base + (index × bytes)',
    '',
    '📦 Bytes per type:',
    '• char  = 1 byte',
    '• int   = 4 bytes',
    '• float = 8 bytes',
    '',
    '⚡ Why O(1)?',
    'Arrays use math to jump directly',
    'to any element. No scanning needed.',
    '',
    '🔑 All elements stored in',
    'contiguous memory blocks.',
  ].join('\n');

  ngOnInit(): void {
    this.generateBaseAddress();
  }

  clearArray(): void {
    this.arrayInput = '';
    this.currentArray = [];
    this.errorMessage = '';
    this.indexInput = '';
    this.valueInput = '';
    this.layoutService.setFallbackArray([]);
    this.visualizationService.reset();
    this.visualizationService.loadSteps([]);
    this.isTableShown.set(false);
  }

  parseArray(input: string): number[] {
    return input
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseFloat(s));
  }

  validateArray(arr: number[]): string | null {
    if (arr.length < 2 || arr.length > 100) return 'Array must have between 2 and 100 elements';
    for (const val of arr) {
      if (isNaN(val)) return 'Please enter valid numbers only';
      if (val < -1000000 || val > 1000000) return 'Values must be between -1000000 and 1000000';
      const decimalStr = val.toString().split('.')[1];
      if (decimalStr && decimalStr.length > 5) return 'Values can have up to 5 decimal places only';
    }
    return null;
  }

  get showIndexInput(): boolean {
    return ['access', 'update', 'insert-position', 'delete-position'].includes(this.selectedOperation);
  }

  get showValueInput(): boolean {
    return ['insert-head', 'insert-tail', 'insert-position', 'update', 'search'].includes(this.selectedOperation);
  }

  generateRandomArray(): void {
    if (!Number.isInteger(this.generateCount) || this.generateCount < 2 || this.generateCount > 100) {
      this.errorMessage = 'Count must be an integer between 2 and 100';
      return;
    }
    if (this.selectedType === 'float' && (!Number.isInteger(this._decimalCount) || this._decimalCount < 0 || this._decimalCount > 5)) {
      this.errorMessage = 'Decimals must be between 0 and 5';
      return;
    }
    if (this.selectedType !== 'char' && this.minValue >= this.maxValue) {
      this.errorMessage = 'Min Value must be less than Max Value';
      return;
    }

    this.errorMessage = '';
    const total = this.generateCount;

    if (this.selectedType === 'char') {
      const chars: string[] = [];
      for (let i = 0; i < total; i++) {
        const charCode = Math.floor(Math.random() * 26) + 97;
        chars.push(String.fromCharCode(charCode));
      }
      this.arrayInput = chars.join(', ');
      this.currentArray = chars as any;
      this.previewArray();
      return;
    }

    const decimals = this._decimalCount;
    const range = this.maxValue - this.minValue;
    const arr: number[] = [];
    for (let i = 0; i < total; i++) {
      const num = Math.random() * range + this.minValue;
      const places = decimals;
      arr.push(Math.round(num * Math.pow(10, places)) / Math.pow(10, places));
    }

    this.arrayInput = arr.join(', ');
    this.currentArray = [...arr];
    this.previewArray();
    this.isTableShown.set(false);
  }

  previewArray(): void {
    if (this.selectedType === 'char') {
      const chars = this.arrayInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const error = this.validateCharArray(chars);
      if (error) {
        this.errorMessage = error;
        return;
      }
      this.errorMessage = '';
      this.currentArray = chars;
      this.layoutService.setFallbackArray(chars);
      this.visualizationService.reset();
      this.visualizationService.loadSteps([]);
      return;
    }

    const parsed = this.parseArray(this.arrayInput);
    const error = this.validateArray(parsed);
    if (error) {
      this.errorMessage = error;
      return;
    }
    this.errorMessage = '';
    this.currentArray = parsed;
    this.layoutService.setFallbackArray(parsed);
    this.visualizationService.reset();
    this.visualizationService.loadSteps([]);
  }

  validateCharArray(arr: string[]): string | null {
    if (arr.length < 2 || arr.length > 100) return 'Array must have between 2 and 100 elements';
    for (const val of arr) {
      if (val.length !== 1) return 'Each element must be a single character';
    }
    return null;
  }

  onTypeChange(): void {
    if (this.selectedType !== 'float') {
      this._decimalCount = 0;
    }
  }

  async visualizeOperation(): Promise<void> {
    setTimeout(async () => {
      if (!this.arrayInput.trim()) {
        this.errorMessage = 'Please enter an array first';
        return;
      }

      let array: (number | string)[];
      let validationError: string | null;

      if (this.selectedType === 'char') {
        array = this.arrayInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
        validationError = this.validateCharArray(array as string[]);
      } else {
        array = this.parseArray(this.arrayInput);
        validationError = this.validateArray(array as number[]);
      }

      if (validationError) {
        this.errorMessage = validationError;
        return;
      }

      if (this.showIndexInput && (this.indexInput === '' || isNaN(parseFloat(this.indexInput)))) {
        this.errorMessage = 'Please enter a valid index';
        return;
      }

      if (this.showValueInput && (!this.valueInput || String(this.valueInput).trim() === '')) {
        this.errorMessage = 'Please enter a valid value';
        return;
      }

      const index = this.showIndexInput ? parseFloat(this.indexInput) : 0;
      const value = this.showValueInput ? (this.selectedType === 'char' ? this.valueInput : parseFloat(this.valueInput)) : 0;

      if (this.showIndexInput) {
        if (this.selectedOperation === 'insert-position' && (index < 0 || index > array.length)) {
          this.errorMessage = 'Invalid index for insert operation';
          return;
        }
        if ((this.selectedOperation === 'access' || this.selectedOperation === 'delete-position') && (index < 0 || index >= array.length)) {
          this.errorMessage = 'Invalid index';
          return;
        }
      }

      this.currentArray = array;
      this.isLoading = true;
      this.errorMessage = '';

      let effectiveOperation = this.selectedOperation;
      if (this.selectedOperation === 'insert-position') {
        if (index === 0) {
          effectiveOperation = 'insert-head';
        } else if (index === array.length) {
          effectiveOperation = 'insert-tail';
        }
      }
      if (this.selectedOperation === 'delete-position') {
        if (index === 0) {
          effectiveOperation = 'delete-head';
        } else if (index === array.length - 1) {
          effectiveOperation = 'delete-tail';
        }
      }
      this.currentOperation = effectiveOperation;

      try {
        const body: any = { array };
        if (this.showIndexInput) body.index = index;
        if (this.showValueInput) body.value = value;
        body.baseAddress = this.baseAddress;
        body.selectedType = this.selectedType;
        body.listType = this.selectedLinkedListType;

        const response = await this.apiService.executeOperation(effectiveOperation, body);
        this.visualizationService.loadSteps(response.steps);

        if (response.steps.length > 0) {
          const finalStep = response.steps[response.steps.length - 1];
          this.arrayInput = finalStep.currentArray.join(', ');
          this.layoutService.setFallbackArray(finalStep.currentArray);
        }
        this.isTableShown.set(true);
      } catch (error) {
        this.errorMessage = 'Failed to execute operation. Please try again.';
        console.error('Error:', error);
      } finally {
        this.isLoading = false;
      }
    });
  }

  generateBaseAddress(): void {
    const base = Math.floor(Math.random() * 0xffff) * 0x10000;
    this.baseAddress = '0x' + base.toString(16).toUpperCase().padStart(8, '0');
  }

  onOperationChange(): void {
    this.visualizationService.loadSteps([]);
    this.indexInput = '';
    this.valueInput = '';
    this.currentOperation = this.selectedOperation;
    this.isTableShown.set(false);
    if (this.selectedOperation === 'access') {
      this.generateBaseAddress();
    }
  }

  getHint(): string {
    const isArabic = this.languageService.isArabic;
    const hints: Record<string, { en: string; ar: string }> = {
      access: { en: 'Linked List access is O(n) - must traverse from head to reach the index. No direct index access like arrays!', ar: 'الوصول في القائمة المترابطة هو O(n) - يجب المرور من البداية للوصول للفهرس. لا يوجد وصول مباشر مثل المصفوفات!' },
      update: { en: 'Update at a position is O(n) - must traverse to find the node first, then update its value.', ar: 'التحديث في موقع معين هو O(n) - يجب المرور لإيجاد العقدة أولاً، ثم تحديث قيمتها.' },
      'insert-head': { en: 'Insert at head is O(1) - just create new node and point it to current head. No traversal needed!', ar: 'الإضافة في البداية هي O(1) - فقط أنشئ عقدة جديدة وأشر لها إلى العقدة الحالية. لا حاجة للمرور!' },
      'insert-tail': { en: 'Insert at tail is O(n) - must traverse to the end. Keep a tail pointer for O(1) insertion at end.', ar: 'الإضافة في النهاية هي O(n) - يجب المرور للنهاية. احتفظ بمؤشر نهاية لإضافة O(1)!' },
      'insert-position': { en: 'Insert at position is O(n) - must traverse to the position. Insert between nodes by updating pointers.', ar: 'الإضافة في موقع معين هي O(n) - يجب المرور للموقع. أضف بين العقد بتحديث المؤشرات.' },
      'delete-head': { en: 'Delete at head is O(1) - just move head pointer to next node. No traversal needed!', ar: 'الحذف من البداية هو O(1) - فقط حرك مؤشر البداية للعقدة التالية. لا حاجة للمرور!' },
      'delete-tail': { en: 'Delete at tail is O(n) - must traverse to find second-to-last node to update its next pointer.', ar: 'الحذف من النهاية هو O(n) - يجب المرور لإيجاد العقدة قبل الأخيرة لتحديث مؤشرها.' },
      'delete-position': { en: 'Delete at position is O(n) - must traverse to the position. Update previous node to skip deleted node.', ar: 'الحذف في موقع معين هو O(n) - يجب المرور للموقع.حدث العقدة السابقة لتجاوز العقدة المحذوفة.' },
      search: { en: 'Search in linked list is O(n) - must scan each node until found. Same as array linear search.', ar: 'البحث في القائمة المترابطة هو O(n) - يجب فحص كل عقدة حتى يجد الهدف. نفس البحث الخطي في المصفوفات.' },
      traverse: { en: 'Traversal visits each node from head until null. Shows the linked structure clearly.', ar: 'العبور يزور كل عقدة من البداية حتى النهاية. يوضح بنية القائمة المترابطة بوضوح.' },
    };
    return hints[this.selectedOperation]?.[isArabic ? 'ar' : 'en'] || '';
  }

  getOperationComparison() {
    const isArabic = this.languageService.isArabic;
    const isDoubly = this.selectedLinkedListType === 'doubly';
    const isCircular = this.selectedLinkedListType === 'circular';
    const isDoublyCircular = this.selectedLinkedListType === 'doubly-circular';

    const getInsertDeleteHeadComplexity = () => isCircular ? 'O(n)' : 'O(1)';
    const getTailComplexity = () => isDoubly || isDoublyCircular ? 'O(1)' : 'O(n)';

    const getInsertHeadDescription = () => {
      if (isCircular) return { en: 'Traverse to tail to update circular link, then insert', ar: 'المرور للنهاية لتحديث الرابط الدائري، ثم الإضافة' };
      if (isDoublyCircular) return { en: 'Use prev pointer to instantly update tail link', ar: 'استخدام المؤشر السابق لتحديث رابط النهاية فوراً' };
      return { en: 'Simply point new node to current head', ar: 'فقط أشر العقدة الجديدة للبداية الحالية' };
    };

    const getDeleteHeadDescription = () => {
      if (isCircular) return { en: 'Traverse to tail to update circular link, then delete', ar: 'المرور للنهاية لتحديث الرابط الدائري، ثم الحذف' };
      if (isDoublyCircular) return { en: 'Use prev pointer to instantly update tail link', ar: 'استخدام المؤشر السابق لتحديث رابط النهاية فوراً' };
      return { en: 'Just update head pointer to next node', ar: 'تحديث مؤشر البداية للعقدة التالية' };
    };

    const comparisons: Record<string, any> = {
      'access': { arrayComplexity: 'O(1)', linkedListComplexity: 'O(n)', arrayDescription: { en: 'Direct memory address calculation', ar: 'حساب عنوان الذاكرة المباشر' }, linkedListDescription: { en: 'Must traverse from head node by node', ar: 'يجب المرور من البداية عقدة بعقدة' }, opName: { en: 'Access', ar: 'الوصول' } },
      'update': { arrayComplexity: 'O(1)', linkedListComplexity: 'O(n)', arrayDescription: { en: 'Direct memory access to update value', ar: 'وصول مباشر للذاكرة لتحديث القيمة' }, linkedListDescription: { en: 'Must traverse to node before updating', ar: 'يجب المرور للعقدة قبل التحديث' }, opName: { en: 'Update', ar: 'التحديث' } },
      'insert-head': { arrayComplexity: 'O(n)', linkedListComplexity: getInsertDeleteHeadComplexity(), arrayDescription: { en: 'Must shift all existing elements right', ar: 'يجب إزاحة كل العناصر لليمين' }, linkedListDescription: getInsertHeadDescription(), opName: { en: 'Insert at Head', ar: 'الإضافة في البداية' } },
      'insert-tail': { arrayComplexity: 'O(1) / O(n)', linkedListComplexity: getTailComplexity(), arrayDescription: { en: 'O(1) if capacity allows, O(n) if resize needed', ar: 'O(1) إذا كانت السعة تسمح، O(n) إذا تطلب إعادة تحجيم' }, linkedListDescription: { en: 'Depends on tail pointer availability', ar: 'تعتمد على وجود مؤشر للنهاية' }, opName: { en: 'Insert at Tail', ar: 'الإضافة في النهاية' } },
      'insert-position': { arrayComplexity: 'O(n)', linkedListComplexity: 'O(n)', arrayDescription: { en: 'Must shift elements right after insertion point', ar: 'يجب إزاحة العناصر يميناً بعد الإضافة' }, linkedListDescription: { en: 'Must traverse to position, then O(1) pointers', ar: 'يجب المرور للموقع، ثم تحديث بـ O(1)' }, opName: { en: 'Insert at Position', ar: 'الإضافة في موقع' } },
      'delete-head': { arrayComplexity: 'O(n)', linkedListComplexity: getInsertDeleteHeadComplexity(), arrayDescription: { en: 'Must shift all elements left to fill gap', ar: 'يجب إزاحة العناصر لليسار لملء الفراغ' }, linkedListDescription: getDeleteHeadDescription(), opName: { en: 'Delete at Head', ar: 'الحذف من البداية' } },
      'delete-tail': { arrayComplexity: 'O(1)', linkedListComplexity: getTailComplexity(), arrayDescription: { en: 'Simply decrement logical size of array', ar: 'إنقاص الحجم المنطقي للمصفوفة' }, linkedListDescription: { en: 'Depends on ability to access node before tail', ar: 'تعتمد على القدرة على الوصول للعقدة قبل النهاية' }, opName: { en: 'Delete at Tail', ar: 'الحذف من النهاية' } },
      'delete-position': { arrayComplexity: 'O(n)', linkedListComplexity: 'O(n)', arrayDescription: { en: 'Must shift elements left after deletion point', ar: 'يجب إزاحة العناصر لليسار بعد الحذف' }, linkedListDescription: { en: 'Traverse to position, then O(1) bypass pointer', ar: 'المرور للموقع، ثم تخطي العقدة المحذوفة' }, opName: { en: 'Delete at Position', ar: 'الحذف في موقع' } },
      'search': { arrayComplexity: 'O(n)', linkedListComplexity: 'O(n)', arrayDescription: { en: 'Linear scan of contiguous memory block', ar: 'مسح خطي لكتلة الذاكرة المتجاورة' }, linkedListDescription: { en: 'Linear scan following pointers node by node', ar: 'مسح خطي بتتبع المؤشرات عقدة بعقدة' }, opName: { en: 'Search', ar: 'البحث' } },
      'traverse': { arrayComplexity: 'O(n)', linkedListComplexity: 'O(n)', arrayDescription: { en: 'Iterate sequentially via index increments', ar: 'التكرار التسلسلي بزيادة الفهرس' }, linkedListDescription: { en: 'Iterate sequentially following next pointers', ar: 'التكرار التسلسلي بتتبع المؤشرات' }, opName: { en: 'Traverse', ar: 'المرور المتسلسل' } },
    };

    const comp = comparisons[this.selectedOperation];
    if (!comp) return null;

    return {
      arrayComplexity: comp.arrayComplexity,
      linkedListComplexity: comp.linkedListComplexity,
      arrayDescription: isArabic ? comp.arrayDescription.ar : comp.arrayDescription.en,
      linkedListDescription: isArabic ? comp.linkedListDescription.ar : comp.linkedListDescription.en,
      operationName: isArabic ? comp.opName.ar : comp.opName.en,
    };
  }
}
