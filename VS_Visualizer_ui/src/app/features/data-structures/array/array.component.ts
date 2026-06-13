import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClient } from '@angular/common/http';
import { VisualizationService } from '../../../core/services/visualization.service';
import { ControlPanelComponent } from '../../../shared/components/control-panel/control-panel.component';
import { StepExplanationComponent } from '../../../shared/components/step-explanation/step-explanation.component';
import { firstValueFrom } from 'rxjs';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment.production';

interface VisualizationStep {
  stepNumber: number;
  description: string;
  highlightedIndices: number[];
  swappedIndices: number[];
  currentArray: number[];
}

interface AlgorithmResponse {
  steps: VisualizationStep[];
  totalSteps: number;
  algorithmType: string;
}

@Component({
  selector: 'app-array',
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
  ],
  templateUrl: './array.component.html',
  styleUrl: './array.component.css',
  providers: [VisualizationService],
})
export class ArrayComponent {
  private http = inject(HttpClient);
  visualizationService = inject(VisualizationService);
  languageService = inject(LanguageService);

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
  indexInput = '';
  valueInput = '';
  isLoading = false;
  errorMessage = '';
  currentArray: (number | string)[] = [];

  operations = [
    { value: 'access', label: 'Access by Index' },
    { value: 'update', label: 'Update at Position' },
    { value: 'insert', label: 'Insert at Position' },
    { value: 'delete', label: 'Delete at Position' },
    { value: 'search', label: 'Search for Value' },
    { value: 'traverse', label: 'Traverse the Array' },
  ];

  typeOptions = [
    { value: 'char', label: 'Char' },
    { value: 'int', label: 'Integer' },
    { value: 'float', label: 'Float' },
  ];

  selectedType = 'int';

  constructor() {}

  ngOnInit(): void {
    this.generateBaseAddress();
  }

  clearArray(): void {
    this.arrayInput = '';
    this.currentArray = [];
    this.errorMessage = '';
    this.indexInput = '';
    this.valueInput = '';
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

      // Allow up to 5 decimal places only
      const decimalStr = val.toString().split('.')[1];
      if (decimalStr && decimalStr.length > 5) return 'Values can have up to 5 decimal places only';
    }
    return null; // valid
  }

  get showIndexInput(): boolean {
    return ['access', 'update', 'insert', 'delete'].includes(this.selectedOperation);
  }

  get showValueInput(): boolean {
    return ['insert', 'update', 'search'].includes(this.selectedOperation);
  }

  generateRandomArray(): void {
    // Validate generateCount
    if (
      !Number.isInteger(this.generateCount) ||
      this.generateCount < 2 ||
      this.generateCount > 100
    ) {
      this.errorMessage = 'Count must be an integer between 2 and 100';
      return;
    }

    // Validate decimalCount (only for float type)
    if (
      this.selectedType === 'float' &&
      (!Number.isInteger(this._decimalCount) || this._decimalCount < 0 || this._decimalCount > 5)
    ) {
      this.errorMessage = 'Decimals must be between 0 and 5';
      return;
    }

    // Validate minValue and maxValue (only for non-char types)
    if (this.selectedType !== 'char' && this.minValue >= this.maxValue) {
      this.errorMessage = 'Min Value must be less than Max Value';
      return;
    }

    this.errorMessage = '';
    const total = this.generateCount;

    // Generate characters if selected
    if (this.selectedType === 'char') {
      const chars: string[] = [];
      for (let i = 0; i < total; i++) {
        const charCode = Math.floor(Math.random() * 26) + 97; // a-z
        chars.push(String.fromCharCode(charCode));
      }
      this.arrayInput = chars.join(', ');
      this.currentArray = chars as any;
      this.previewArray();
      return;
    }

    const decimals = this._decimalCount;
    const range = this.maxValue - this.minValue;

    // Generate array with exact number of decimals
    const arr: number[] = [];

    // Generate decimal numbers first
    for (let i = 0; i < total; i++) {
      const num = Math.random() * range + this.minValue;
      // Round to random decimal places between 1-5
      const places = decimals;
      arr.push(Math.round(num * Math.pow(10, places)) / Math.pow(10, places));
    }

    this.arrayInput = arr.join(', ');
    this.currentArray = [...arr];
    this.previewArray();
  }

  previewArray(): void {
    const parsed = this.parseArray(this.arrayInput);
    const error = this.validateArray(parsed);
    if (error) {
      this.errorMessage = error;
      return;
    }
    this.errorMessage = '';
    this.currentArray = parsed;
    this.visualizationService.reset();
    this.visualizationService.loadSteps([]);
  }

  async visualizeOperation(): Promise<void> {
    if (!this.arrayInput.trim()) {
      this.errorMessage = 'Please enter an array first';
      return;
    }

    const array = this.parseArray(this.arrayInput);

    const validationError = this.validateArray(array);
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    if (this.showIndexInput && (!this.indexInput || isNaN(parseFloat(this.indexInput)))) {
      this.errorMessage = 'Please enter a valid index';
      return;
    }

    if (
      this.showValueInput &&
      (!this.valueInput ||
        String(this.valueInput).trim() === '' ||
        isNaN(parseFloat(this.valueInput)))
    ) {
      this.errorMessage = 'Please enter a valid value';
      return;
    }

    const index = this.showIndexInput ? parseFloat(this.indexInput) : 0;
    const value = this.showValueInput ? parseFloat(this.valueInput) : 0;

    // Validate index
    if (this.showIndexInput) {
      if (this.selectedOperation === 'insert' && (index < 0 || index > array.length)) {
        this.errorMessage = 'Invalid index for insert operation';
        return;
      }
      if (
        (this.selectedOperation === 'access' || this.selectedOperation === 'delete') &&
        (index < 0 || index >= array.length)
      ) {
        this.errorMessage = 'Invalid index';
        return;
      }
    }

    this.currentArray = array;
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const endpoint = this.getEndpoint();
      const body: any = { array: array };

      if (this.showIndexInput) {
        body.index = index;
      }
      if (this.showValueInput) {
        body.value = value;
      }
      body.baseAddress = this.baseAddress;
      body.selectedType = this.selectedType;

      const response: AlgorithmResponse = await firstValueFrom(
        this.http.post<AlgorithmResponse>(`${environment.apiUrl}${endpoint}`, body),
      );

      this.visualizationService.loadSteps(response.steps);

      // Update currentArray with final state from last step
      if (response.steps.length > 0) {
        const finalStep = response.steps[response.steps.length - 1];
        this.currentArray = finalStep.currentArray;
        this.arrayInput = this.currentArray.join(', ');
      }
    } catch (error) {
      this.errorMessage = 'Failed to execute operation. Please try again.';
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private getEndpoint(): string {
    switch (this.selectedOperation) {
      case 'access':
        return '/api/data-structures/array/access';
      case 'update':
        return '/api/data-structures/array/update';
      case 'insert':
        return '/api/data-structures/array/insert';
      case 'delete':
        return '/api/data-structures/array/delete';
      case 'search':
        return '/api/data-structures/array/search';
      case 'traverse':
        return '/api/data-structures/array/traverse';
      default:
        return '';
    }
  }

  get displayArray(): (number | string)[] {
    const stepData = (this.visualizationService as any).currentStepData();
    return stepData?.currentArray || this.currentArray;
  }

  get boxWidth(): number {
    if (!this.displayArray || this.displayArray.length === 0) return 60;
    const maxLength = this.displayArray.reduce((max: number, val) => {
      const len = String(val).length;
      return len > max ? len : max;
    }, 0);
    // Calculate width: base 60px + 12px per character, max 250px, min 60px
    return Math.min(Math.max(60 + maxLength * 12, 60), 250);
  }

  isHighlighted(index: number): boolean {
    const highlighted =
      (this.visualizationService as any).currentStepData()?.highlightedIndices || [];
    return highlighted.includes(index);
  }

  isSwapped(index: number): boolean {
    const swapped = (this.visualizationService as any).currentStepData()?.swappedIndices || [];
    return swapped.includes(index);
  }

  isFound(index: number): boolean {
    const stepData = (this.visualizationService as any).currentStepData();
    const description = stepData?.description || '';
    return description.includes('Found') && this.isHighlighted(index);
  }

  getPointer(index: number) {
    const stepData = (this.visualizationService as any).currentStepData();
    return stepData?.pointers?.[index];
  }

  // Memory visualization properties
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

  // Generate random base address aligned to 64KB boundary
  generateBaseAddress(): void {
    const base = Math.floor(Math.random() * 0xffff) * 0x10000;
    this.baseAddress = '0x' + base.toString(16).toUpperCase().padStart(8, '0');
  }

  // Calculate memory address for specific index and byte size
  getAddress(index: number, bytes: number): string {
    const baseNum = parseInt(this.baseAddress, 16);
    const address = baseNum + index * bytes;
    return '0x' + address.toString(16).toUpperCase().padStart(8, '0');
  }

  // Get byte size for selected type
  getSelectedTypeBytes(): number {
    switch (this.selectedType) {
      case 'char':
        return 1;
      case 'int':
        return 4;
      case 'float':
        return 8;
      default:
        return 4;
    }
  }

  setBoxHighlighted(index: number) {
    this.indexInput = '' + index;
  }

  // Check if box should be highlighted based on selected index
  isBoxHighlighted(index: number): boolean {
    return (
      this.selectedOperation === 'access' &&
      this.indexInput !== '' &&
      !isNaN(parseInt(this.indexInput)) &&
      parseInt(this.indexInput) === index
    );
  }

  // Initialize when operation changes to access
  onOperationChange(): void {
    // Clear any highlighted elements when changing operations
    this.visualizationService.reset();
    this.indexInput = '';
    this.valueInput = '';

    if (this.selectedOperation === 'access') {
      this.generateBaseAddress();
    }
  }

  getHint(): string {
    const isArabic = this.languageService.isArabic;
    const hints: Record<string, { en: string; ar: string }> = {
      access: {
        en: 'Arrays provide O(1) direct access by index. No need to iterate!',
        ar: 'توفر المصفوفات وصولاً مباشراً عبر الفهرس (وهو رقم يعبر عن موقع العنصر) بزمن قدره O(1)؛ فلا داعي للمرور على كل العناصر!',
      },
      update: {
        en: 'Updating an element at a specific index is O(1) - just overwrite the value!',
        ar: 'تحديث عنصر في فهرس (وهو رقم يعبر عن موقع العنصر) محدد يتم في زمن قدره O(1)؛ فكل ما عليك هو استبدال القيمة القديمة فقط!',
      },
      insert: {
        en: 'Insert requires shifting all elements after the insertion point - O(n) operation!',
        ar: 'عملية الإضافة تتطلب تحريك كافة العناصر التي بعد نقطة الإضافة؛ لذا فهي عملية تستغرق زمناً قدره O(n)!',
      },
      delete: {
        en: 'Delete requires shifting elements to fill the gap - O(n) operation!',
        ar: 'عملية الحذف تتطلب تحريك العناصر لسد الفجوة الناتجة؛ لذا فهي عملية تستغرق زمناً قدره O(n)!',
      },
      search: {
        en: 'Linear search scans each element until found - O(n) worst case!',
        ar: 'البحث الخطي يقوم بفحص كل عنصر حتى يجد الهدف؛ لذا فهو يستغرق زمناً قدره O(n) في الحالة الأسوأ!',
      },
      traverse: {
        en: 'Traversal visits each element exactly once - O(n) time complexity!',
        ar: 'عملية التجوّل (المرور على العناصر) تقوم بزيارة كل عنصر مرة واحدة فقط؛ لذا فإن المدة الزمنية لها هي O(n)!',
      },
    };

    return hints[this.selectedOperation]?.[isArabic ? 'ar' : 'en'] || '';
  }
}
