import { NavigationOptions, State, Router } from 'router5'
import React, { Component, HTMLAttributes, MouseEventHandler } from 'react'
export interface BaseLinkProps extends HTMLAttributes<HTMLElement> {
    routeName: string
    routeParams?: {
        [key: string]: any
    }
    routeOptions?: NavigationOptions
    className?: string
    activeClassName?: string
    activeStrict?: boolean
    ignoreQueryParams?: boolean
    onClick?: MouseEventHandler<HTMLElement>
    onMouseOver?: MouseEventHandler<HTMLElement>
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
            onMouseOver?: (event: React.MouseEvent<HTMLElement>) => void
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
            onCopy?: (event: React.ClipboardEvent<HTMLElement>) => void
            onCopyCapture?: (event: React.ClipboardEvent<HTMLElement>) => void
            onCut?: (event: React.ClipboardEvent<HTMLElement>) => void
            onCutCapture?: (event: React.ClipboardEvent<HTMLElement>) => void
            onPaste?: (event: React.ClipboardEvent<HTMLElement>) => void
            onPasteCapture?: (event: React.ClipboardEvent<HTMLElement>) => void
            onCompositionEnd?: (
                event: React.CompositionEvent<HTMLElement>
            ) => void
            onCompositionEndCapture?: (
                event: React.CompositionEvent<HTMLElement>
            ) => void
            onCompositionStart?: (
                event: React.CompositionEvent<HTMLElement>
            ) => void
            onCompositionStartCapture?: (
                event: React.CompositionEvent<HTMLElement>
            ) => void
            onCompositionUpdate?: (
                event: React.CompositionEvent<HTMLElement>
            ) => void
            onCompositionUpdateCapture?: (
                event: React.CompositionEvent<HTMLElement>
            ) => void
            onFocus?: (event: React.FocusEvent<HTMLElement>) => void
            onFocusCapture?: (event: React.FocusEvent<HTMLElement>) => void
            onBlur?: (event: React.FocusEvent<HTMLElement>) => void
            onBlurCapture?: (event: React.FocusEvent<HTMLElement>) => void
            onChange?: (event: React.FormEvent<HTMLElement>) => void
            onChangeCapture?: (event: React.FormEvent<HTMLElement>) => void
            onInput?: (event: React.FormEvent<HTMLElement>) => void
            onInputCapture?: (event: React.FormEvent<HTMLElement>) => void
            onReset?: (event: React.FormEvent<HTMLElement>) => void
            onResetCapture?: (event: React.FormEvent<HTMLElement>) => void
            onSubmit?: (event: React.FormEvent<HTMLElement>) => void
            onSubmitCapture?: (event: React.FormEvent<HTMLElement>) => void
            onInvalid?: (event: React.FormEvent<HTMLElement>) => void
            onInvalidCapture?: (event: React.FormEvent<HTMLElement>) => void
            onLoad?: (event: React.SyntheticEvent<HTMLElement>) => void
            onLoadCapture?: (event: React.SyntheticEvent<HTMLElement>) => void
            onError?: (event: React.SyntheticEvent<HTMLElement>) => void
            onErrorCapture?: (event: React.SyntheticEvent<HTMLElement>) => void
            onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void
            onKeyDownCapture?: (event: React.KeyboardEvent<HTMLElement>) => void
            onKeyPress?: (event: React.KeyboardEvent<HTMLElement>) => void
            onKeyPressCapture?: (
                event: React.KeyboardEvent<HTMLElement>
            ) => void
            onKeyUp?: (event: React.KeyboardEvent<HTMLElement>) => void
            onKeyUpCapture?: (event: React.KeyboardEvent<HTMLElement>) => void
            onAbort?: (event: React.SyntheticEvent<HTMLElement>) => void
            onAbortCapture?: (event: React.SyntheticEvent<HTMLElement>) => void
            onCanPlay?: (event: React.SyntheticEvent<HTMLElement>) => void
            onCanPlayCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onCanPlayThrough?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onCanPlayThroughCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onDurationChange?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onDurationChangeCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onEmptied?: (event: React.SyntheticEvent<HTMLElement>) => void
            onEmptiedCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onEncrypted?: (event: React.SyntheticEvent<HTMLElement>) => void
            onEncryptedCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onEnded?: (event: React.SyntheticEvent<HTMLElement>) => void
            onEndedCapture?: (event: React.SyntheticEvent<HTMLElement>) => void
            onLoadedData?: (event: React.SyntheticEvent<HTMLElement>) => void
            onLoadedDataCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onLoadedMetadata?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onLoadedMetadataCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onLoadStart?: (event: React.SyntheticEvent<HTMLElement>) => void
            onLoadStartCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onPause?: (event: React.SyntheticEvent<HTMLElement>) => void
            onPauseCapture?: (event: React.SyntheticEvent<HTMLElement>) => void
            onPlay?: (event: React.SyntheticEvent<HTMLElement>) => void
            onPlayCapture?: (event: React.SyntheticEvent<HTMLElement>) => void
            onPlaying?: (event: React.SyntheticEvent<HTMLElement>) => void
            onPlayingCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onProgress?: (event: React.SyntheticEvent<HTMLElement>) => void
            onProgressCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onRateChange?: (event: React.SyntheticEvent<HTMLElement>) => void
            onRateChangeCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onSeeked?: (event: React.SyntheticEvent<HTMLElement>) => void
            onSeekedCapture?: (event: React.SyntheticEvent<HTMLElement>) => void
            onSeeking?: (event: React.SyntheticEvent<HTMLElement>) => void
            onSeekingCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onStalled?: (event: React.SyntheticEvent<HTMLElement>) => void
            onStalledCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onSuspend?: (event: React.SyntheticEvent<HTMLElement>) => void
            onSuspendCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onTimeUpdate?: (event: React.SyntheticEvent<HTMLElement>) => void
            onTimeUpdateCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onVolumeChange?: (event: React.SyntheticEvent<HTMLElement>) => void
            onVolumeChangeCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onWaiting?: (event: React.SyntheticEvent<HTMLElement>) => void
            onWaitingCapture?: (
                event: React.SyntheticEvent<HTMLElement>
            ) => void
            onClickCapture?: (event: React.MouseEvent<HTMLElement>) => void
            onContextMenu?: (event: React.MouseEvent<HTMLElement>) => void
            onContextMenuCapture?: (
                event: React.MouseEvent<HTMLElement>
            ) => void
            onDoubleClick?: (event: React.MouseEvent<HTMLElement>) => void
            onDoubleClickCapture?: (
                event: React.MouseEvent<HTMLElement>
            ) => void
            onDrag?: (event: React.DragEvent<HTMLElement>) => void
            onDragCapture?: (event: React.DragEvent<HTMLElement>) => void
            onDragEnd?: (event: React.DragEvent<HTMLElement>) => void
            onDragEndCapture?: (event: React.DragEvent<HTMLElement>) => void
            onDragEnter?: (event: React.DragEvent<HTMLElement>) => void
            onDragEnterCapture?: (event: React.DragEvent<HTMLElement>) => void
            onDragExit?: (event: React.DragEvent<HTMLElement>) => void
            onDragExitCapture?: (event: React.DragEvent<HTMLElement>) => void
            onDragLeave?: (event: React.DragEvent<HTMLElement>) => void
            onDragLeaveCapture?: (event: React.DragEvent<HTMLElement>) => void
            onDragOver?: (event: React.DragEvent<HTMLElement>) => void
            onDragOverCapture?: (event: React.DragEvent<HTMLElement>) => void
            onDragStart?: (event: React.DragEvent<HTMLElement>) => void
            onDragStartCapture?: (event: React.DragEvent<HTMLElement>) => void
            onDrop?: (event: React.DragEvent<HTMLElement>) => void
            onDropCapture?: (event: React.DragEvent<HTMLElement>) => void
            onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void
            onMouseDownCapture?: (event: React.MouseEvent<HTMLElement>) => void
            onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void
            onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void
            onMouseMove?: (event: React.MouseEvent<HTMLElement>) => void
            onMouseMoveCapture?: (event: React.MouseEvent<HTMLElement>) => void
            onMouseOut?: (event: React.MouseEvent<HTMLElement>) => void
            onMouseOutCapture?: (event: React.MouseEvent<HTMLElement>) => void
            onMouseOverCapture?: (event: React.MouseEvent<HTMLElement>) => void
            onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void
            onMouseUpCapture?: (event: React.MouseEvent<HTMLElement>) => void
            onSelect?: (event: React.SyntheticEvent<HTMLElement>) => void
            onSelectCapture?: (event: React.SyntheticEvent<HTMLElement>) => void
            onTouchCancel?: (event: React.TouchEvent<HTMLElement>) => void
            onTouchCancelCapture?: (
                event: React.TouchEvent<HTMLElement>
            ) => void
            onTouchEnd?: (event: React.TouchEvent<HTMLElement>) => void
            onTouchEndCapture?: (event: React.TouchEvent<HTMLElement>) => void
            onTouchMove?: (event: React.TouchEvent<HTMLElement>) => void
            onTouchMoveCapture?: (event: React.TouchEvent<HTMLElement>) => void
            onTouchStart?: (event: React.TouchEvent<HTMLElement>) => void
            onTouchStartCapture?: (event: React.TouchEvent<HTMLElement>) => void
            onPointerDown?: (event: React.PointerEvent<HTMLElement>) => void
            onPointerDownCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onPointerMove?: (event: React.PointerEvent<HTMLElement>) => void
            onPointerMoveCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onPointerUp?: (event: React.PointerEvent<HTMLElement>) => void
            onPointerUpCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onPointerCancel?: (event: React.PointerEvent<HTMLElement>) => void
            onPointerCancelCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onPointerEnter?: (event: React.PointerEvent<HTMLElement>) => void
            onPointerEnterCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onPointerLeave?: (event: React.PointerEvent<HTMLElement>) => void
            onPointerLeaveCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onPointerOver?: (event: React.PointerEvent<HTMLElement>) => void
            onPointerOverCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onPointerOut?: (event: React.PointerEvent<HTMLElement>) => void
            onPointerOutCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onGotPointerCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onGotPointerCaptureCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onLostPointerCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onLostPointerCaptureCapture?: (
                event: React.PointerEvent<HTMLElement>
            ) => void
            onScroll?: (event: React.UIEvent<HTMLElement>) => void
            onScrollCapture?: (event: React.UIEvent<HTMLElement>) => void
            onWheel?: (event: React.WheelEvent<HTMLElement>) => void
            onWheelCapture?: (event: React.WheelEvent<HTMLElement>) => void
            onAnimationStart?: (
                event: React.AnimationEvent<HTMLElement>
            ) => void
            onAnimationStartCapture?: (
                event: React.AnimationEvent<HTMLElement>
            ) => void
            onAnimationEnd?: (event: React.AnimationEvent<HTMLElement>) => void
            onAnimationEndCapture?: (
                event: React.AnimationEvent<HTMLElement>
            ) => void
            onAnimationIteration?: (
                event: React.AnimationEvent<HTMLElement>
            ) => void
            onAnimationIterationCapture?: (
                event: React.AnimationEvent<HTMLElement>
            ) => void
            onTransitionEnd?: (
                event: React.TransitionEvent<HTMLElement>
            ) => void
            onTransitionEndCapture?: (
                event: React.TransitionEvent<HTMLElement>
            ) => void
        },
        HTMLElement
    >
}
export default BaseLink
