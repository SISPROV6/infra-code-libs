import { DOCUMENT } from '@angular/common';
import {
	Directive,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';

@Directive({
    selector: '[clickOutside], [libClickOutside]',
    standalone: true
})
export class ClickOutsideDirective implements OnInit, OnChanges, OnDestroy {
	@Input() clickOutsideEnabled = true;
    
	@Input() attachOutsideOnClick = false;
	@Input() delayClickOutsideInit = false;
	@Input() emitOnBlur = false;

	@Input() exclude = '';
	@Input() excludeBeforeClick = false;

	@Input() clickOutsideEvents = '';

	@Output() clickOutside: EventEmitter<Event> = new EventEmitter<Event>();

	private _nodesExcluded: Array<HTMLElement> = [];
	private _events: Array<string> = ['click'];

	constructor(
		private _el: ElementRef,
		private _ngZone: NgZone,
		@Inject(DOCUMENT) private document: Document) {
		this._initOnClickBody = this._initOnClickBody.bind(this);
		this._onClickBody = this._onClickBody.bind(this);
		this._onWindowBlur = this._onWindowBlur.bind(this);
	}

	ngOnInit() {
		this._init();
	}

	ngOnDestroy() {
		this._removeClickOutsideListener();
		this._removeAttachOutsideOnClickListener();
		this._removeWindowBlurListener();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['attachOutsideOnClick'] || changes['exclude'] || changes['emitOnBlur']) {
			this._init();
		}
	}

	private _init() {
		if (this.clickOutsideEvents !== '') {
			this._events = this.clickOutsideEvents.split(',').map(e => e.trim());
		}

		this._excludeCheck();

		if (this.attachOutsideOnClick) {
			this._initAttachOutsideOnClickListener();
		} else {
			this._initOnClickBody();
		}

		if (this.emitOnBlur) {
			this._initWindowBlurListener();
		}
	}

	private _initOnClickBody() {
		if (this.delayClickOutsideInit) {
			setTimeout(this._initClickOutsideListener.bind(this));
		} else {
			this._initClickOutsideListener();
		}
	}

	private _excludeCheck() {
		if (this.exclude) {
			try {
		const nodes = Array.from(this.document.querySelectorAll(this.exclude)) as Array<HTMLElement>;
		if (nodes) {
			this._nodesExcluded = nodes;
		}
			} catch (err) {
		console.error('[ng-click-outside] Check your exclude selector syntax.', err);
			}
		}
	}

	private _onClickBody(ev: Event) {
		if (!this.clickOutsideEnabled) {
			return;
		}

		if (this.excludeBeforeClick) {
			this._excludeCheck();
		}

		if (!this._el.nativeElement.contains(ev.target) && !this._shouldExclude(ev.target)) {
			this._emit(ev);

			if (this.attachOutsideOnClick) {
		this._removeClickOutsideListener();
			}
		}
	}

	/**
	 * Resolves problem with outside click on iframe
	 * @see https://github.com/arkon/ng-click-outside/issues/32
	 */
	private _onWindowBlur(ev: Event) {
		setTimeout(() => {
			if (!this.document.hidden) {
		this._emit(ev);
			}
		});
	}

	private _emit(ev: Event) {
		if (!this.clickOutsideEnabled) {
			return;
		}

		this._ngZone.run(() => this.clickOutside.emit(ev));
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _shouldExclude(target: any): boolean {
		for (const excludedNode of this._nodesExcluded) {
			if (excludedNode.contains(target)) {
		return true;
			}
		}

		return false;
	}

	private _initClickOutsideListener() {
		this._ngZone.runOutsideAngular(() => {
			this._events.forEach(e => this.document.addEventListener(e, this._onClickBody));
		});
	}

	private _removeClickOutsideListener() {
		this._ngZone.runOutsideAngular(() => {
			this._events.forEach(e => this.document.removeEventListener(e, this._onClickBody));
		});
	}

	private _initAttachOutsideOnClickListener() {
		this._ngZone.runOutsideAngular(() => {
			this._events.forEach(e => this._el.nativeElement.addEventListener(e, this._initOnClickBody));
		});
	}

	private _removeAttachOutsideOnClickListener() {
		this._ngZone.runOutsideAngular(() => {
			this._events.forEach(e => this._el.nativeElement.removeEventListener(e, this._initOnClickBody));
		});
	}

	private _initWindowBlurListener() {
		this._ngZone.runOutsideAngular(() => {
			window.addEventListener('blur', this._onWindowBlur);
		});
	}

	private _removeWindowBlurListener() {
		this._ngZone.runOutsideAngular(() => {
			window.removeEventListener('blur', this._onWindowBlur);
		});
	}

}
