import { NavigationOptions, State, Router } from 'router5'
import React, { Component, HTMLAttributes, MouseEventHandler } from 'react'
export interface BaseLinkProps extends HTMLAttributes<HTMLAnchorElement> {
    routeName: string
    routeParams?: {
        [key: string]: any
    }
    routeOptions?: NavigationOptions
    className?: string
    activeClassName?: string
    activeStrict?: boolean
    ignoreQueryParams?: boolean
    onClick?: MouseEventHandler<HTMLAnchorElement>
    onMouseOver?: MouseEventHandler<HTMLAnchorElement>
    successCallback?(state?: State): void
    errorCallback?(error?: any): void
    target?: string
    route?: State
    previousRoute?: State
    router: Router
}
export interface BaseLinkState {
    active: boolean
}
declare class BaseLink extends Component<BaseLinkProps, BaseLinkState> {
    router: Router
    constructor(props: any, context: any)
    buildUrl(routeName: any, routeParams: any): any
    isActive(): boolean
    callback(err: any, state: any): void
    clickHandler(evt: any): void
    render(): React.DetailedReactHTMLElement<
        {
            href: any
            className: string
            onClick: (evt: any) => void
            onMouseOver?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            target?: string
            defaultChecked?: boolean
            defaultValue?: string | string[]
            suppressContentEditableWarning?: boolean
            suppressHydrationWarning?: boolean
            accessKey?: string
            contentEditable?: boolean
            contextMenu?: string
            dir?: string
            draggable?: boolean
            hidden?: boolean
            id?: string
            lang?: string
            placeholder?: string
            slot?: string
            spellCheck?: boolean
            style?: React.CSSProperties
            tabIndex?: number
            title?: string
            inputMode?: string
            is?: string
            radioGroup?: string
            role?: string
            about?: string
            datatype?: string
            inlist?: any
            prefix?: string
            property?: string
            resource?: string
            typeof?: string
            vocab?: string
            autoCapitalize?: string
            autoCorrect?: string
            autoSave?: string
            color?: string
            itemProp?: string
            itemScope?: boolean
            itemType?: string
            itemID?: string
            itemRef?: string
            results?: number
            security?: string
            unselectable?: 'on' | 'off'
            'aria-activedescendant'?: string
            'aria-atomic'?: boolean | 'false' | 'true'
            'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
            'aria-busy'?: boolean | 'false' | 'true'
            'aria-checked'?: boolean | 'false' | 'true' | 'mixed'
            'aria-colcount'?: number
            'aria-colindex'?: number
            'aria-colspan'?: number
            'aria-controls'?: string
            'aria-current'?:
                | boolean
                | 'time'
                | 'false'
                | 'true'
                | 'page'
                | 'step'
                | 'location'
                | 'date'
            'aria-describedby'?: string
            'aria-details'?: string
            'aria-disabled'?: boolean | 'false' | 'true'
            'aria-dropeffect'?:
                | 'link'
                | 'none'
                | 'copy'
                | 'execute'
                | 'move'
                | 'popup'
            'aria-errormessage'?: string
            'aria-expanded'?: boolean | 'false' | 'true'
            'aria-flowto'?: string
            'aria-grabbed'?: boolean | 'false' | 'true'
            'aria-haspopup'?:
                | boolean
                | 'dialog'
                | 'menu'
                | 'false'
                | 'true'
                | 'listbox'
                | 'tree'
                | 'grid'
            'aria-hidden'?: boolean | 'false' | 'true'
            'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling'
            'aria-keyshortcuts'?: string
            'aria-label'?: string
            'aria-labelledby'?: string
            'aria-level'?: number
            'aria-live'?: 'off' | 'assertive' | 'polite'
            'aria-modal'?: boolean | 'false' | 'true'
            'aria-multiline'?: boolean | 'false' | 'true'
            'aria-multiselectable'?: boolean | 'false' | 'true'
            'aria-orientation'?: 'horizontal' | 'vertical'
            'aria-owns'?: string
            'aria-placeholder'?: string
            'aria-posinset'?: number
            'aria-pressed'?: boolean | 'false' | 'true' | 'mixed'
            'aria-readonly'?: boolean | 'false' | 'true'
            'aria-relevant'?:
                | 'additions'
                | 'additions text'
                | 'all'
                | 'removals'
                | 'text'
            'aria-required'?: boolean | 'false' | 'true'
            'aria-roledescription'?: string
            'aria-rowcount'?: number
            'aria-rowindex'?: number
            'aria-rowspan'?: number
            'aria-selected'?: boolean | 'false' | 'true'
            'aria-setsize'?: number
            'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other'
            'aria-valuemax'?: number
            'aria-valuemin'?: number
            'aria-valuenow'?: number
            'aria-valuetext'?: string
            dangerouslySetInnerHTML?: {
                __html: string
            }
            onCopy?: (event: React.ClipboardEvent<HTMLAnchorElement>) => void
            onCopyCapture?: (
                event: React.ClipboardEvent<HTMLAnchorElement>
            ) => void
            onCut?: (event: React.ClipboardEvent<HTMLAnchorElement>) => void
            onCutCapture?: (
                event: React.ClipboardEvent<HTMLAnchorElement>
            ) => void
            onPaste?: (event: React.ClipboardEvent<HTMLAnchorElement>) => void
            onPasteCapture?: (
                event: React.ClipboardEvent<HTMLAnchorElement>
            ) => void
            onCompositionEnd?: (
                event: React.CompositionEvent<HTMLAnchorElement>
            ) => void
            onCompositionEndCapture?: (
                event: React.CompositionEvent<HTMLAnchorElement>
            ) => void
            onCompositionStart?: (
                event: React.CompositionEvent<HTMLAnchorElement>
            ) => void
            onCompositionStartCapture?: (
                event: React.CompositionEvent<HTMLAnchorElement>
            ) => void
            onCompositionUpdate?: (
                event: React.CompositionEvent<HTMLAnchorElement>
            ) => void
            onCompositionUpdateCapture?: (
                event: React.CompositionEvent<HTMLAnchorElement>
            ) => void
            onFocus?: (event: React.FocusEvent<HTMLAnchorElement>) => void
            onFocusCapture?: (
                event: React.FocusEvent<HTMLAnchorElement>
            ) => void
            onBlur?: (event: React.FocusEvent<HTMLAnchorElement>) => void
            onBlurCapture?: (event: React.FocusEvent<HTMLAnchorElement>) => void
            onChange?: (event: React.FormEvent<HTMLAnchorElement>) => void
            onChangeCapture?: (
                event: React.FormEvent<HTMLAnchorElement>
            ) => void
            onBeforeInput?: (event: React.FormEvent<HTMLAnchorElement>) => void
            onBeforeInputCapture?: (
                event: React.FormEvent<HTMLAnchorElement>
            ) => void
            onInput?: (event: React.FormEvent<HTMLAnchorElement>) => void
            onInputCapture?: (event: React.FormEvent<HTMLAnchorElement>) => void
            onReset?: (event: React.FormEvent<HTMLAnchorElement>) => void
            onResetCapture?: (event: React.FormEvent<HTMLAnchorElement>) => void
            onSubmit?: (event: React.FormEvent<HTMLAnchorElement>) => void
            onSubmitCapture?: (
                event: React.FormEvent<HTMLAnchorElement>
            ) => void
            onInvalid?: (event: React.FormEvent<HTMLAnchorElement>) => void
            onInvalidCapture?: (
                event: React.FormEvent<HTMLAnchorElement>
            ) => void
            onLoad?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onLoadCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onError?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onErrorCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onKeyDown?: (event: React.KeyboardEvent<HTMLAnchorElement>) => void
            onKeyDownCapture?: (
                event: React.KeyboardEvent<HTMLAnchorElement>
            ) => void
            onKeyPress?: (event: React.KeyboardEvent<HTMLAnchorElement>) => void
            onKeyPressCapture?: (
                event: React.KeyboardEvent<HTMLAnchorElement>
            ) => void
            onKeyUp?: (event: React.KeyboardEvent<HTMLAnchorElement>) => void
            onKeyUpCapture?: (
                event: React.KeyboardEvent<HTMLAnchorElement>
            ) => void
            onAbort?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onAbortCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onCanPlay?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onCanPlayCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onCanPlayThrough?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onCanPlayThroughCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onDurationChange?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onDurationChangeCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onEmptied?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onEmptiedCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onEncrypted?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onEncryptedCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onEnded?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onEndedCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onLoadedData?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onLoadedDataCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onLoadedMetadata?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onLoadedMetadataCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onLoadStart?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onLoadStartCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onPause?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onPauseCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onPlay?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onPlayCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onPlaying?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onPlayingCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onProgress?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onProgressCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onRateChange?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onRateChangeCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onSeeked?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onSeekedCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onSeeking?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onSeekingCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onStalled?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onStalledCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onSuspend?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onSuspendCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onTimeUpdate?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onTimeUpdateCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onVolumeChange?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onVolumeChangeCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onWaiting?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onWaitingCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onClickCapture?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onContextMenu?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onContextMenuCapture?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onDoubleClick?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onDoubleClickCapture?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onDrag?: (event: React.DragEvent<HTMLAnchorElement>) => void
            onDragCapture?: (event: React.DragEvent<HTMLAnchorElement>) => void
            onDragEnd?: (event: React.DragEvent<HTMLAnchorElement>) => void
            onDragEndCapture?: (
                event: React.DragEvent<HTMLAnchorElement>
            ) => void
            onDragEnter?: (event: React.DragEvent<HTMLAnchorElement>) => void
            onDragEnterCapture?: (
                event: React.DragEvent<HTMLAnchorElement>
            ) => void
            onDragExit?: (event: React.DragEvent<HTMLAnchorElement>) => void
            onDragExitCapture?: (
                event: React.DragEvent<HTMLAnchorElement>
            ) => void
            onDragLeave?: (event: React.DragEvent<HTMLAnchorElement>) => void
            onDragLeaveCapture?: (
                event: React.DragEvent<HTMLAnchorElement>
            ) => void
            onDragOver?: (event: React.DragEvent<HTMLAnchorElement>) => void
            onDragOverCapture?: (
                event: React.DragEvent<HTMLAnchorElement>
            ) => void
            onDragStart?: (event: React.DragEvent<HTMLAnchorElement>) => void
            onDragStartCapture?: (
                event: React.DragEvent<HTMLAnchorElement>
            ) => void
            onDrop?: (event: React.DragEvent<HTMLAnchorElement>) => void
            onDropCapture?: (event: React.DragEvent<HTMLAnchorElement>) => void
            onMouseDown?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onMouseDownCapture?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onMouseEnter?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onMouseLeave?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onMouseMove?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onMouseMoveCapture?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onMouseOut?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onMouseOutCapture?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onMouseOverCapture?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onMouseUp?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onMouseUpCapture?: (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => void
            onSelect?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onSelectCapture?: (
                event: React.SyntheticEvent<HTMLAnchorElement, Event>
            ) => void
            onTouchCancel?: (event: React.TouchEvent<HTMLAnchorElement>) => void
            onTouchCancelCapture?: (
                event: React.TouchEvent<HTMLAnchorElement>
            ) => void
            onTouchEnd?: (event: React.TouchEvent<HTMLAnchorElement>) => void
            onTouchEndCapture?: (
                event: React.TouchEvent<HTMLAnchorElement>
            ) => void
            onTouchMove?: (event: React.TouchEvent<HTMLAnchorElement>) => void
            onTouchMoveCapture?: (
                event: React.TouchEvent<HTMLAnchorElement>
            ) => void
            onTouchStart?: (event: React.TouchEvent<HTMLAnchorElement>) => void
            onTouchStartCapture?: (
                event: React.TouchEvent<HTMLAnchorElement>
            ) => void
            onPointerDown?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerDownCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerMove?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerMoveCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerUp?: (event: React.PointerEvent<HTMLAnchorElement>) => void
            onPointerUpCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerCancel?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerCancelCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerEnter?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerEnterCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerLeave?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerLeaveCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerOver?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerOverCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerOut?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onPointerOutCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onGotPointerCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onGotPointerCaptureCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onLostPointerCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onLostPointerCaptureCapture?: (
                event: React.PointerEvent<HTMLAnchorElement>
            ) => void
            onScroll?: (event: React.UIEvent<HTMLAnchorElement>) => void
            onScrollCapture?: (event: React.UIEvent<HTMLAnchorElement>) => void
            onWheel?: (event: React.WheelEvent<HTMLAnchorElement>) => void
            onWheelCapture?: (
                event: React.WheelEvent<HTMLAnchorElement>
            ) => void
            onAnimationStart?: (
                event: React.AnimationEvent<HTMLAnchorElement>
            ) => void
            onAnimationStartCapture?: (
                event: React.AnimationEvent<HTMLAnchorElement>
            ) => void
            onAnimationEnd?: (
                event: React.AnimationEvent<HTMLAnchorElement>
            ) => void
            onAnimationEndCapture?: (
                event: React.AnimationEvent<HTMLAnchorElement>
            ) => void
            onAnimationIteration?: (
                event: React.AnimationEvent<HTMLAnchorElement>
            ) => void
            onAnimationIterationCapture?: (
                event: React.AnimationEvent<HTMLAnchorElement>
            ) => void
            onTransitionEnd?: (
                event: React.TransitionEvent<HTMLAnchorElement>
            ) => void
            onTransitionEndCapture?: (
                event: React.TransitionEvent<HTMLAnchorElement>
            ) => void
        },
        HTMLElement
    >
}
export default BaseLink
