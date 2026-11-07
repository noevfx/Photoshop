/**
 * Helper functions for ExtendScript API
 * ExtendScript is the legacy scripting API for Photoshop
 */
/** Curves adjustment layer helper — shared by atomics and recipes (uses __mcp_s2t / __mcp_c2t). */
export declare const MCP_CURVES_ADJUSTMENT_HELPER = "\nfunction __mcp_makeCurvesAdjustmentLayer(preset) {\n  var usePreset = preset || 'auto_tone';\n  var desc = new ActionDescriptor();\n  var ref = new ActionReference();\n  ref.putClass(__mcp_s2t('adjustmentLayer'));\n  desc.putReference(__mcp_s2t('null'), ref);\n  var using = new ActionDescriptor();\n  var curvesAdjust = new ActionDescriptor();\n  var curvesAdjustments = new ActionList();\n  var curvesPair = new ActionDescriptor();\n  var curvesPoints = new ActionList();\n  var ptBlack = new ActionDescriptor();\n  var ptWhite = new ActionDescriptor();\n  if (usePreset === 'neutral') {\n    ptBlack.putDouble(__mcp_c2t('Hrzn'), 0);\n    ptBlack.putDouble(__mcp_c2t('Vrtc'), 0);\n    ptWhite.putDouble(__mcp_c2t('Hrzn'), 255);\n    ptWhite.putDouble(__mcp_c2t('Vrtc'), 255);\n  } else {\n    ptBlack.putDouble(__mcp_c2t('Hrzn'), 12);\n    ptBlack.putDouble(__mcp_c2t('Vrtc'), 0);\n    ptWhite.putDouble(__mcp_c2t('Hrzn'), 243);\n    ptWhite.putDouble(__mcp_c2t('Vrtc'), 255);\n  }\n  curvesPoints.putObject(__mcp_c2t('Pnt '), ptBlack);\n  curvesPoints.putObject(__mcp_c2t('Pnt '), ptWhite);\n  curvesPair.putList(__mcp_c2t('Crv '), curvesPoints);\n  var channelRef = new ActionReference();\n  channelRef.putEnumerated(__mcp_c2t('Chnl'), __mcp_c2t('Chnl'), __mcp_c2t('Cmps'));\n  curvesPair.putReference(__mcp_c2t('Chnl'), channelRef);\n  curvesAdjustments.putObject(__mcp_c2t('CrvA'), curvesPair);\n  curvesAdjust.putList(__mcp_c2t('Adjs'), curvesAdjustments);\n  using.putObject(__mcp_s2t('type'), __mcp_s2t('curves'), curvesAdjust);\n  desc.putObject(__mcp_s2t('using'), __mcp_s2t('adjustmentLayer'), using);\n  executeAction(__mcp_s2t('make'), desc, DialogModes.NO);\n  return app.activeDocument.activeLayer;\n}\n";
/**
 * Layer mask helpers — Adobe Community / StackSupport.jsx patterns.
 * @see https://community.adobe.com/t5/photoshop-ecosystem-discussions/is-it-possible-to-make-a-layer-mask-with-the-current-selection-using-extendscript/td-p/10872052
 * @see https://github.com/LeZuse/photoshop-scripts/blob/master/default/Stack%20Scripts%20Only/StackSupport.jsx
 */
/**
 * Smart Object helpers — newPlacedLayer, placedLayerReplaceContents, placedLayerEditContents,
 * placedLayerMakeCopy (Adobe Community, Photopea, laryn gist, c.pfaffenbichler).
 * Requires `helperFunctions` (cTID/sTID) in the enclosing script.
 */
export declare const MCP_SMART_OBJECT_HELPERS = "\nfunction __mcp_findLayer(container, name) {\n  for (var i = 0; i < container.layers.length; i++) {\n    var l = container.layers[i];\n    if (l.name === name) return l;\n  }\n  for (var j = 0; j < container.layerSets.length; j++) {\n    var nested = __mcp_findLayer(container.layerSets[j], name);\n    if (nested) return nested;\n  }\n  return null;\n}\n\nfunction __mcp_activateLayerByName(layerName) {\n  var doc = app.activeDocument;\n  if (!layerName) {\n    if (!doc.activeLayer) {\n      return { ok: false, code: 'layer_not_found', message: 'No active layer' };\n    }\n    return { ok: true, layer: doc.activeLayer };\n  }\n  var target = __mcp_findLayer(doc, layerName);\n  if (!target) {\n    return {\n      ok: false,\n      code: 'layer_not_found',\n      message: 'Layer not found: ' + layerName,\n      suggested_next_tool: 'photoshop_get_layers'\n    };\n  }\n  doc.activeLayer = target;\n  return { ok: true, layer: target };\n}\n\nfunction __mcp_replaceSmartObjectContents(filePath) {\n  var layer = app.activeDocument.activeLayer;\n  if (layer.kind !== LayerKind.SMARTOBJECT) {\n    return {\n      ok: false,\n      code: 'unsupported_layer_kind',\n      message: 'Target layer \"' + layer.name + '\" is not a Smart Object (kind=' + layer.kind + ').',\n      suggested_next_tool: 'photoshop_get_layers'\n    };\n  }\n  var assetFile = new File(filePath);\n  if (!assetFile.exists) {\n    return { ok: false, code: 'file_not_found', message: 'Replacement file not found: ' + filePath };\n  }\n  var replaceDesc = new ActionDescriptor();\n  replaceDesc.putPath(cTID('null'), assetFile);\n  replaceDesc.putInteger(cTID('PgNm'), 1);\n  executeAction(sTID('placedLayerReplaceContents'), replaceDesc, DialogModes.NO);\n  return {\n    ok: true,\n    layerName: app.activeDocument.activeLayer.name,\n    filePath: filePath\n  };\n}\n";
export declare const MCP_LAYER_MASK_HELPERS = "\nfunction __mcp_hasLayerMaskAM() {\n  var ref = new ActionReference();\n  var args = new ActionDescriptor();\n  ref.putProperty(cTID('Prpr'), cTID('UsrM'));\n  ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));\n  args.putReference(cTID('null'), ref);\n  try {\n    var resultDesc = executeAction(cTID('getd'), args, DialogModes.NO);\n    return resultDesc.hasKey(cTID('UsrM'));\n  } catch (e) {\n    return false;\n  }\n}\n\nfunction __mcp_makeLayerMaskAtChannel(maskMode) {\n  var desc = new ActionDescriptor();\n  var atRef = new ActionReference();\n  desc.putClass(sTID('new'), sTID('channel'));\n  atRef.putEnumerated(sTID('channel'), sTID('channel'), sTID('mask'));\n  desc.putReference(sTID('at'), atRef);\n  desc.putEnumerated(sTID('using'), sTID('userMaskEnabled'), sTID(maskMode));\n  executeAction(sTID('make'), desc, DialogModes.NO);\n}\n\nfunction __mcp_selectLayerMaskChannel() {\n  var selRef = new ActionReference();\n  selRef.putEnumerated(cTID('Chnl'), cTID('Ordn'), cTID('Trgt'));\n  var selDesc = new ActionDescriptor();\n  selDesc.putReference(cTID('null'), selRef);\n  selDesc.putBoolean(cTID('MkVs'), true);\n  executeAction(cTID('slct'), selDesc, DialogModes.NO);\n}\n\nfunction __mcp_pointDescPx(x, y) {\n  var desc = new ActionDescriptor();\n  desc.putUnitDouble(cTID('Hrzn'), cTID('#Pxl'), x);\n  desc.putUnitDouble(cTID('Vrtc'), cTID('#Pxl'), y);\n  return desc;\n}\n\nfunction __mcp_gradientStop(location, midPoint) {\n  var desc = new ActionDescriptor();\n  desc.putInteger(cTID('Lctn'), location);\n  desc.putInteger(cTID('Mdpn'), midPoint);\n  return desc;\n}\n\nfunction __mcp_grayColor(grayValue) {\n  var desc = new ActionDescriptor();\n  desc.putDouble(cTID('Gry '), grayValue);\n  return desc;\n}\n\n/** Linear black-to-white gradient on the active mask channel (StackSupport.jsx pattern). */\nfunction __mcp_gradientFillLayerMask(fromXPx, fromYPx, toXPx, toYPx, reverseGradient) {\n  var args = new ActionDescriptor();\n  args.putObject(cTID('From'), cTID('Pnt '), __mcp_pointDescPx(fromXPx, fromYPx));\n  args.putObject(cTID('T   '), cTID('Pnt '), __mcp_pointDescPx(toXPx, toYPx));\n  args.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Nrml'));\n  args.putEnumerated(cTID('Type'), cTID('GrdT'), cTID('Lnr '));\n  args.putBoolean(cTID('Dthr'), true);\n  args.putBoolean(cTID('UsMs'), true);\n  args.putBoolean(cTID('Rvrs'), !!reverseGradient);\n\n  var gradDesc = new ActionDescriptor();\n  gradDesc.putString(cTID('Nm  '), 'Black, White');\n  gradDesc.putEnumerated(cTID('GrdF'), cTID('GrdF'), cTID('CstS'));\n  gradDesc.putDouble(cTID('Intr'), 4096.0);\n\n  var colorList = new ActionList();\n  var stopWhite = __mcp_gradientStop(0, 50);\n  stopWhite.putObject(cTID('Clr '), cTID('Grsc'), __mcp_grayColor(100.0));\n  stopWhite.putEnumerated(cTID('Type'), cTID('Clry'), cTID('UsrS'));\n  colorList.putObject(cTID('Clrt'), stopWhite);\n  var stopBlack = __mcp_gradientStop(4096, 50);\n  stopBlack.putObject(cTID('Clr '), cTID('Grsc'), __mcp_grayColor(0.0));\n  stopBlack.putEnumerated(cTID('Type'), cTID('Clry'), cTID('UsrS'));\n  colorList.putObject(cTID('Clrt'), stopBlack);\n  gradDesc.putList(cTID('Clrs'), colorList);\n\n  var xferList = new ActionList();\n  var xferA = __mcp_gradientStop(0, 50);\n  xferA.putUnitDouble(cTID('Opct'), cTID('#Prc'), 100.0);\n  xferList.putObject(cTID('TrnS'), xferA);\n  var xferB = __mcp_gradientStop(4096, 50);\n  xferB.putUnitDouble(cTID('Opct'), cTID('#Prc'), 100.0);\n  xferList.putObject(cTID('TrnS'), xferB);\n  gradDesc.putList(cTID('Trns'), xferList);\n\n  args.putObject(cTID('Grad'), cTID('Grdn'), gradDesc);\n  executeAction(cTID('Grdn'), args, DialogModes.NO);\n}\n";
/**
 * Clipping mask helpers — groupEvent AM create; grouped DOM release.
 * @see https://stackoverflow.com/questions/13842581/photoshop-js-script-to-create-and-apply-a-layer-mask
 * @see https://community.adobe.com/t5/photoshop-ecosystem-discussions/clipping-mask-script-issues-in-ps-2025-on-mac/td-p/1178313
 * @see https://www.ps-scripts.com/viewtopic.php?t=10955 (layer.grouped property)
 */
export declare const MCP_CLIPPING_MASK_HELPERS = "\nfunction __mcp_getLayerBelow(layer) {\n  var container = layer.parent;\n  var stack = container.layers;\n  for (var i = 0; i < stack.length; i++) {\n    if (stack[i] === layer) {\n      if (i >= stack.length - 1) return null;\n      return stack[i + 1];\n    }\n  }\n  return null;\n}\n\nfunction __mcp_createClippingMaskAM() {\n  var desc = new ActionDescriptor();\n  var ref = new ActionReference();\n  ref.putEnumerated(sTID('layer'), sTID('ordinal'), sTID('targetEnum'));\n  desc.putReference(sTID('null'), ref);\n  executeAction(sTID('groupEvent'), desc, DialogModes.NO);\n}\n";
export type CurvesPreset = 'auto_tone' | 'neutral';
export type GradientMaskDirection = 'top_to_bottom' | 'bottom_to_top' | 'left_to_right' | 'right_to_left';
/**
 * Common ExtendScript snippets
 */
export declare const ExtendScriptSnippets: {
    /**
     * Get Photoshop application info
     */
    getAppInfo: () => string;
    /**
     * Create a new document
     */
    newDocument: (width: number, height: number, resolution?: number, colorMode?: string) => string;
    /**
     * Get active document info
     */
    getDocumentInfo: () => string;
    /**
     * List all open documents (read-only).
     * @see https://developer.adobe.com/photoshop/uxp/ps_reference/classes/documents/
     */
    listDocuments: () => string;
    /**
     * Activate an open document by id, tab index, or name.
     * @see https://stackoverflow.com/questions/4537506/how-to-switch-between-open-documents-in-photoshop-using-javascript
     */
    setActiveDocument: (params: {
        documentId?: number;
        documentName?: string;
        index?: number;
    }) => string;
    /**
     * Create a text layer
     */
    createTextLayer: (text: string, x?: number, y?: number, fontSize?: number, fontName?: string, styleLiteral?: string) => string;
    /**
     * Place an image file as a layer.
     * x/y are absolute canvas coordinates for the placed layer's top-left bound
     * (not an offset from Photoshop's default centered Place).
     */
    placeImage: (filePath: string, x?: number, y?: number) => string;
    /**
     * Open an image file as a new document
     */
    openImage: (filePath: string) => string;
    /**
     * Save document as PSD
     */
    saveAsPSD: (path: string) => string;
    /**
     * Save document as JPEG
     */
    saveAsJPEG: (path: string, quality?: number) => string;
    /**
     * Save document as PNG
     */
    saveAsPNG: (path: string) => string;
    /**
     * Close active document
     */
    closeDocument: (save?: boolean) => string;
    /**
     * Create a new layer
     */
    newLayer: (name?: string) => string;
    /**
     * Delete active layer
     */
    deleteLayer: () => string;
    /**
     * Fill the active layer with a solid RGB color.
     *
     * ArtLayer has no fillPath() method (that exists on PathItem only).
     * The correct approach is Selection.fill(): preserve any existing
     * selection, otherwise select the whole canvas, fill, then deselect.
     * Background / fully-locked layers cannot be filled, so fail clearly.
     */
    fillLayer: (red: number, green: number, blue: number) => string;
    /**
     * Two-color linear gradient on the active layer's pixels (not the mask).
     * Document.gradients does not exist in ExtendScript; this uses the gradient tool action.
     */
    fillLinearGradient: (fromRed: number, fromGreen: number, fromBlue: number, toRed: number, toGreen: number, toBlue: number, direction: "left_to_right" | "right_to_left" | "top_to_bottom" | "bottom_to_top") => string;
    /**
     * Resize image
     */
    resizeImage: (width: number, height: number) => string;
    /**
     * Get all layer names
     */
    getLayerNames: () => string;
    /**
     * Select layer by name (recursive search including layer groups)
     */
    selectLayerByName: (name: string) => string;
    /**
     * Scale active layer to fit document (maintain aspect ratio)
     */
    fitLayerToDocument: (fillDocument?: boolean) => string;
    /**
     * Scale active layer by percentage
     */
    scaleLayer: (scalePercent: number, centerAnchor?: boolean) => string;
    /**
     * Move/translate active layer
     */
    moveLayer: (deltaX: number, deltaY: number) => string;
    /**
     * Rotate active layer
     */
    rotateLayer: (degrees: number) => string;
    /**
     * Set layer opacity
     */
    setLayerOpacity: (opacity: number) => string;
    /**
     * Set layer blend mode.
     * `blendMode` is an ExtendScript BlendMode identifier (e.g. COLORBLEND, not COLOR).
     * Darker Color / Lighter Color fall back to Action Manager when the DOM enum is absent.
     */
    setLayerBlendMode: (blendMode: string) => string;
    /**
     * Set layer visibility
     */
    setLayerVisibility: (visible: boolean) => string;
    /**
     * Lock/unlock layer
     */
    setLayerLocked: (locked: boolean) => string;
    /**
     * Rename active layer
     */
    renameLayer: (newName: string) => string;
    /**
     * Duplicate active layer.
     *
     * DOM layer.duplicate() does NOT activate the duplicate — the original
     * layer stays active, so without the explicit activeLayer assignment any
     * follow-up active-layer tool (masks, filters, transforms) would target
     * the original instead of the copy.
     */
    duplicateLayer: (newName?: string) => string;
    /**
     * Merge visible layers
     */
    mergeVisibleLayers: () => string;
    /**
     * Flatten image (merge all layers)
     */
    flattenImage: () => string;
    /**
     * Apply Gaussian Blur filter
     */
    applyGaussianBlur: (radius: number) => string;
    /**
     * Apply Unsharp Mask (sharpen)
     */
    applyUnsharpMask: (amount: number, radius: number, threshold: number) => string;
    /**
     * Apply Add Noise filter
     */
    applyAddNoise: (amount: number, distribution: string, monochromatic: boolean) => string;
    /**
     * Apply Motion Blur filter
     */
    applyMotionBlur: (angle: number, radius: number) => string;
    /**
     * Apply High Pass filter via Action Manager.
     * @see https://community.adobe.com/t5/photoshop-ecosystem-discussions/high-pass-filter-using-javascript/td-p/1144836
     * @see https://theiviaxx.github.io/photoshop-docs/Photoshop/ArtLayer/applyHighPass.html
     */
    applyHighPass: (radius: number) => string;
    /**
     * Apply Smart Blur filter.
     * @see https://theiviaxx.github.io/photoshop-docs/Photoshop/ArtLayer/applySmartBlur.html
     */
    applySmartBlur: (radius: number, threshold: number, mode: string, quality: string) => string;
    /**
     * Adjust brightness and contrast
     */
    adjustBrightnessContrast: (brightness: number, contrast: number) => string;
    /**
     * Adjust hue, saturation and lightness on the active layer.
     *
     * ArtLayer has no DOM method for Hue/Saturation - adjustColorBalance()
     * is for Color Balance (cyan/red, magenta/green, yellow/blue) and would
     * throw here. The correct path is the "HStr" Action Descriptor which
     * matches the Image > Adjustments > Hue/Saturation menu command.
     */
    adjustHueSaturation: (hue: number, saturation: number, lightness: number) => string;
    /**
     * Auto levels adjustment
     */
    autoLevels: () => string;
    /**
     * Auto contrast adjustment
     */
    autoContrast: () => string;
    /**
     * Create a Curves adjustment layer (auto-tone S-curve or neutral identity curve).
     */
    adjustCurves: (preset?: CurvesPreset) => string;
    /**
     * Desaturate (convert to grayscale without changing color mode)
     */
    desaturate: () => string;
    /**
     * Invert colors
     */
    invert: () => string;
    /**
     * Crop document
     */
    cropDocument: (left: number, top: number, right: number, bottom: number) => string;
    /**
     * Set text layer font
     */
    setTextFont: (fontName: string, fontSize?: number) => string;
    /**
     * List installed fonts (PostScript names required for TextItem.font).
     */
    listFonts: (query?: string, limit?: number) => string;
    /**
     * Rebuild Photoshop's in-memory font list without quitting.
     * Application.refreshFonts() — Adobe Photoshop JavaScript Reference;
     * Photoshop 2026's CC Libraries panel calls the same method.
     */
    refreshFonts: (postScriptNames: string[]) => string;
    /**
     * Set text color
     */
    setTextColor: (red: number, green: number, blue: number) => string;
    /**
     * Set text alignment
     */
    setTextAlignment: (alignment: string) => string;
    /**
     * Update text content
     */
    updateTextContent: (newText: string) => string;
    setTextStyle: (styleLiteral: string) => string;
    setTextRanges: (rangesLiteral: string) => string;
    /**
     * Read active pixel selection bounds (read-only).
     * Uses executeActionGet hasSelection (c.pfaffenbichler) then bounds[].as('px').
     * @see https://stackoverflow.com/questions/41552883/determine-if-selection-is-present
     * @see https://community.adobe.com/t5/photoshop-ecosystem-discussions/can-the-presence-of-a-selection-be-set-to-a-boolean/td-p/1144178
     * @see https://community.adobe.com/t5/photoshop-ecosystem-discussions/selection-bounds-operation/td-p/1101762
     */
    getSelectionBounds: () => string;
    /**
     * Create elliptical marquee selection via Action Manager (setd + Elps).
     * @see https://stackoverflow.com/questions/37082583/elliptical-marquee-selection-then-fill-with-color-in-photoshop-using-javascript
     * @see https://stackoverflow.com/questions/35235191/how-do-i-create-a-circular-or-elliptical-selections-in-javascript-for-use-in-pho
     */
    selectEllipse: (left: number, top: number, right: number, bottom: number) => string;
    /**
     * Expand the active selection by pixels.
     * @see https://theiviaxx.github.io/photoshop-docs/Photoshop/Selection/expand.html
     */
    expandSelection: (pixels: number) => string;
    /**
     * Contract the active selection by pixels.
     * @see https://theiviaxx.github.io/photoshop-docs/Photoshop/Selection/contract.html
     */
    contractSelection: (pixels: number) => string;
    /**
     * Feather the active selection edges by pixels.
     * @see https://www.indesignjs.de/extendscriptAPI/photoshop-latest/Selection.html
     */
    featherSelection: (pixels: number) => string;
    /**
     * Save the active selection to a new alpha channel.
     * @see https://theiviaxx.github.io/photoshop-docs/Photoshop/Selection/store.html
     */
    saveSelection: (channelName?: string) => string;
    /**
     * Create rectangular selection
     */
    selectRectangle: (left: number, top: number, right: number, bottom: number, mode?: "replace" | "add" | "subtract" | "intersect") => string;
    /**
     * Select all
     */
    selectAll: () => string;
    /**
     * Deselect
     */
    deselect: () => string;
    /**
     * Invert selection
     */
    invertSelection: () => string;
    /**
     * Select the main subject on the active layer (DOM selectSubject, then autoCutout fallback).
     */
    selectSubject: (sampleAllLayers?: boolean) => string;
    /**
     * Content-aware fill on the current pixel selection.
     */
    contentAwareFill: () => string;
    /**
     * Create layer mask from selection
     */
    createLayerMask: () => string;
    /**
     * Apply a linear black-to-white gradient on the active layer's mask channel.
     */
    applyGradientMask: (direction?: GradientMaskDirection, startPct?: number, endPct?: number, angleDeg?: number) => string;
    /**
     * Delete layer mask
     */
    deleteLayerMask: () => string;
    /**
     * Create a clipping mask on the active or named layer (groupEvent AM).
     * Active layer must sit directly above the layer to clip into.
     */
    createClippingMask: (layerName?: string) => string;
    /**
     * Release clipping mask on the active or named layer (layer.grouped = false).
     */
    releaseClippingMask: (layerName?: string) => string;
    /**
     * Apply layer mask
     */
    applyLayerMask: () => string;
    /**
     * Play an action from Actions palette
     */
    playAction: (actionName: string, actionSetName: string) => string;
    /**
     * Execute custom JavaScript code
     */
    executeCustomScript: (code: string) => string;
    /**
     * Rasterize active layer
     */
    rasterizeLayer: () => string;
    /**
     * Undo last operation (step backward in history)
     */
    undo: (steps?: number) => string;
    /**
     * Redo operation (step forward in history)
     */
    redo: (steps?: number) => string;
    /**
     * Get history states
     */
    getHistoryStates: () => string;
    /**
     * Move layer to specific position (reorder)
     */
    moveLayerToPosition: (targetLayerName: string, position: string) => string;
    /**
     * Move layer to top of layer stack
     */
    moveLayerToTop: () => string;
    /**
     * Move layer to bottom of layer stack
     */
    moveLayerToBottom: () => string;
    /**
     * Move layer up one position
     */
    moveLayerUp: () => string;
    /**
     * Move layer down one position
     */
    moveLayerDown: () => string;
    /**
     * Lightweight session state snapshot (read-only).
     */
    getState: () => string;
    /**
     * Export a JPEG preview to the system temp folder. Returns filesystem path for Node to read.
     */
    exportPreview: (maxDimension?: number, jpegQuality?: number) => string;
    /**
     * Shared helpers for Firefly generative actions via Action Manager.
     * See docs/plans/2026-07-03-1149-photoshop-ai-features/ and scripts/spike-photoshop-actions.ts.
     */
    generativeHelpers: () => string;
    generativeFill: (prompt: string) => string;
    generativeRemove: (featherPx: number, autoSelectSubject: boolean) => string;
    generativeExpand: (direction: string, prompt: string) => string;
    generativeUpscale: (targetScale: number) => string;
    skyReplacement: (skyImagePath: string) => string;
    generateImage: (prompt: string, width: number, height: number) => string;
    /**
     * Apply a layer style (drop shadow / outer glow / stroke / bevel) via Action Manager layerEffects.
     */
    applyLayerStyle: (options: {
        style: "drop_shadow" | "outer_glow" | "stroke" | "bevel_emboss";
        red: number;
        green: number;
        blue: number;
        opacity: number;
        size: number;
        distance: number;
        angle: number;
    }) => string;
    /**
     * Color Lookup (3D LUT) adjustment layer — cinematic grades via built-in or file-based LUTs.
     */
    applyLut: (lut: string) => string;
    /**
     * Vibrance adjustment layer.
     */
    adjustVibrance: (vibrance: number, saturation: number) => string;
    /**
     * Exposure adjustment layer.
     */
    adjustExposure: (exposure: number, offset: number, gamma: number) => string;
    /**
     * Photo Filter adjustment layer (warming/cooling/tint with density).
     */
    applyPhotoFilter: (red: number, green: number, blue: number, density: number, preserveLuminosity: boolean) => string;
    /**
     * Gradient Map adjustment layer (black→white custom gradient by default).
     */
    applyGradientMap: (reverse: boolean) => string;
    /**
     * List data sets defined on the active document (data-driven graphics).
     */
    listDataSets: () => string;
    /**
     * Import variables/data sets XML (Image > Variables > Data Sets > Import).
     */
    importDataSets: (xmlPath: string) => string;
    /**
     * Batch-export one file per data set: applies each data set then saves a copy.
     */
    applyDataSetsExport: (outputDir: string, format: "JPEG" | "PNG" | "PSD", datasetNames: string[]) => string;
    /**
     * Convert the active or named layer to an embedded Smart Object (newPlacedLayer).
     */
    convertToSmartObject: (layerName?: string) => string;
    /**
     * Replace Smart Object contents from a file (placedLayerReplaceContents + PgNm).
     */
    replaceSmartObjectContents: (filePath: string, layerName?: string) => string;
    /**
     * Open Smart Object embedded contents for editing (placedLayerEditContents).
     * Active document becomes the embedded .psb until saved and closed.
     */
    editSmartObjectContents: (layerName?: string) => string;
    /**
     * Create an independent Smart Object copy (placedLayerMakeCopy).
     */
    createSmartObjectViaCopy: (layerName?: string) => string;
    /**
     * Load image files into one document, convert to a smart object and apply a stack mode.
     * Classic "remove tourists with median stack" without any generative AI.
     */
    imageStackMode: (files: string[], mode: string) => string;
    /**
     * Export a copy of the active document as PNG/JPEG (Save for Web) or WebP/AVIF (native, PS 23.2+).
     * Optional artboardId crops a duplicate to that artboard first (AM artboardRect).
     */
    exportAs: (filePath: string, format: "PNG" | "JPEG" | "WEBP" | "AVIF", quality: number, artboardId?: number) => string;
    listArtboards: () => string;
    createArtboard: (name: string, width: number, height: number, left?: number, top?: number) => string;
    setActiveArtboard: (artboardId?: number, artboardName?: string) => string;
    exportArtboards: (folderPath: string, format: "PNG" | "JPEG" | "WEBP" | "AVIF", quality: number) => string;
};
/**
 * Generate ExtendScript code with error handling
 */
export declare function generateExtendScript(code: string): string;
//# sourceMappingURL=extendscript.d.ts.map