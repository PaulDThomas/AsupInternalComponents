import { DraftComponent } from 'draft-js';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AsupInternalEditor } from '../aie';
import { AioComment, AioExpander, AioIconButton, AioNumber, AioSelect } from '../aio';
import { AsupInternalWindow } from '../aiw';
import { AitCellData, AitCellType, AitLocation, AitRowType } from './aitInterface';
import { TableSettingsContext } from './aitContext';

interface AitCellProps {
  aitid: string;
  text: string;
  justifyText?: DraftComponent.Base.DraftTextAlignment | 'decimal' | 'default';
  comments: string;
  rowSpan: number;
  colSpan: number;
  colWidth?: number;
  displayColWidth?: number;
  textIndents?: number;
  replacedText?: string;
  repeatColSpan?: number;
  repeatRowSpan?: number;
  setCellData?: (ret: AitCellData) => void;
  setColWidth?: (ret: number) => void;
  readOnly: boolean;
  location: AitLocation;
  addColSpan?: (loc: AitLocation) => void;
  removeColSpan?: (loc: AitLocation) => void;
  addRowSpan?: (loc: AitLocation) => void;
  removeRowSpan?: (loc: AitLocation) => void;
  spaceAfterRepeat?: boolean;
  spaceAfterSpan?: number;
}

/*
 * Table cell in AsupInternalTable
 */
export const AitCell = ({
  aitid,
  text,
  justifyText,
  comments,
  colSpan,
  rowSpan,
  colWidth,
  displayColWidth,
  textIndents,
  replacedText,
  repeatColSpan,
  repeatRowSpan,
  setCellData,
  setColWidth,
  readOnly,
  location,
  addColSpan,
  removeColSpan,
  addRowSpan,
  removeRowSpan,
  spaceAfterRepeat,
  spaceAfterSpan,
}: AitCellProps) => {
  // Context
  const tableSettings = useContext(TableSettingsContext);
  // Data holder
  const [displayText, setDisplayText] = useState(replacedText !== undefined ? replacedText : text);
  /* Need to update if these change */
  useEffect(
    () => setDisplayText(replacedText !== undefined ? replacedText : text),
    [replacedText, text],
  );

  const [buttonState, setButtonState] = useState('hidden');
  const [showCellOptions, setShowCellOptions] = useState(false);

  // Static options/variables
  const currentReadOnly = useMemo<boolean>(() => {
    return readOnly || typeof setCellData !== 'function' || replacedText !== undefined;
  }, [readOnly, replacedText, setCellData]);
  const isNotRepeat = useMemo<boolean>(
    () =>
      (location.colRepeat === undefined || location.colRepeat.match(/^[[\]0,]+$/) !== null) &&
      (location.rowRepeat === undefined || location.rowRepeat.match(/^[[\]0,]+$/) !== null),
    [location],
  );

  const cellType = useMemo<AitCellType>(() => {
    const cellType =
      location.tableSection === AitRowType.body &&
      location.column < (tableSettings.rowHeaderColumns ?? 0)
        ? AitCellType.rowHeader
        : location.tableSection === AitRowType.header
        ? AitCellType.header
        : AitCellType.body;
    return cellType;
  }, [location.column, location.tableSection, tableSettings.rowHeaderColumns]);

  // Update cell style when options change
  const cellStyle = useMemo<React.CSSProperties>(() => {
    return {
      overflow: 'visible',
      width: `${tableSettings.colWidthMod * (colWidth ?? tableSettings.defaultCellWidth)}px`,
      paddingLeft:
        cellType === AitCellType.rowHeader && textIndents !== undefined
          ? `${textIndents}rem`
          : undefined,
      borderLeft: tableSettings.showCellBorders ? '1px dashed burlywood' : '',
      borderBottom: tableSettings.showCellBorders ? '1px dashed burlywood' : '',
      borderRight:
        tableSettings.showCellBorders &&
        location.column === (tableSettings.rowHeaderColumns ?? 0) - colSpan
          ? '1px solid burlywood'
          : tableSettings.showCellBorders
          ? '1px dashed burlywood'
          : '',
      borderTop:
        tableSettings.showCellBorders && location.row === 0 && location.rowGroup > 0
          ? '1px solid burlywood'
          : tableSettings.showCellBorders
          ? '1px dashed burlywood'
          : '',
    };
  }, [
    tableSettings.colWidthMod,
    tableSettings.defaultCellWidth,
    tableSettings.showCellBorders,
    tableSettings.rowHeaderColumns,
    colWidth,
    cellType,
    textIndents,
    location.column,
    location.row,
    location.rowGroup,
    colSpan,
  ]);

  /** Callback for update to any cell data */
  const returnData = useCallback(
    (cellUpdate: {
      text?: string;
      justifyText?: DraftComponent.Base.DraftTextAlignment | 'decimal' | null;
      comments?: string;
      colWidth?: number;
      textIndents?: number;
    }) => {
      if (typeof setCellData !== 'function') return;
      const r: AitCellData = {
        aitid: aitid,
        text: cellUpdate.text ?? text,
        justifyText:
          cellUpdate.justifyText === null ? undefined : cellUpdate.justifyText ?? justifyText,
        comments: cellUpdate.comments ?? comments,
        colSpan: colSpan,
        rowSpan: rowSpan,
        colWidth: cellUpdate.colWidth ?? colWidth,
        textIndents: cellUpdate.textIndents ?? textIndents ?? 0,
        replacedText: replacedText,
        repeatColSpan: repeatColSpan,
        repeatRowSpan: repeatRowSpan,
        spaceAfterRepeat: spaceAfterRepeat,
        spaceAfterSpan: spaceAfterSpan,
      };
      setCellData(r);
    },
    [
      aitid,
      colSpan,
      colWidth,
      comments,
      justifyText,
      repeatColSpan,
      repeatRowSpan,
      replacedText,
      rowSpan,
      setCellData,
      spaceAfterRepeat,
      spaceAfterSpan,
      text,
      textIndents,
    ],
  );

  // Show hide/buttons that trigger windows
  const aitShowButtons = () => {
    setButtonState('');
  };
  const aitHideButtons = () => {
    setButtonState('hidden');
  };

  // Do not render if there is no rowSpan or colSpan
  if (colSpan === 0 || rowSpan === 0 || repeatColSpan === 0 || repeatRowSpan === 0) return <></>;

  // Render element
  return (
    <td
      className={[
        'ait-cell',
        cellType === AitCellType.header
          ? 'ait-header-cell'
          : cellType === AitCellType.rowHeader
          ? 'ait-row-header-cell'
          : 'ait-body-cell',
        currentReadOnly ? 'ait-readonly-cell' : '',
      ].join(' ')}
      colSpan={repeatColSpan ?? colSpan ?? 1}
      rowSpan={(repeatRowSpan ?? rowSpan ?? 1) + (spaceAfterSpan ?? 0)}
      style={cellStyle}
      data-location-table-section={location.tableSection}
      data-location-row-group={location.rowGroup}
      data-location-row={location.row}
      data-location-cell={location.column}
    >
      <div
        className='ait-aie-holder'
        onMouseOver={aitShowButtons}
        onMouseLeave={aitHideButtons}
      >
        <>
          <div
            style={{
              position: 'absolute',
              right: '-8px',
              visibility: buttonState === 'hidden' ? 'hidden' : 'visible',
            }}
          >
            {/* Option buttons  */}
            <AioIconButton
              tipText='Cell Options'
              onClick={() => setShowCellOptions(!showCellOptions)}
              iconName='aio-button-cell'
            />
          </div>
        </>

        {/* Cell text editor */}
        <AsupInternalEditor
          style={{ width: '100%', height: '100%', border: 'none' }}
          textAlignment={
            !justifyText || justifyText === 'default'
              ? location.column < (tableSettings.rowHeaderColumns ?? 0)
                ? 'left'
                : 'center'
              : justifyText
          }
          value={displayText}
          setValue={(ret) => {
            setDisplayText(ret);
            returnData({ text: ret.trimStart() });
          }}
          editable={!currentReadOnly}
          showStyleButtons={tableSettings.cellStyles !== undefined}
          styleMap={tableSettings.cellStyles}
          decimalAlignPercent={tableSettings.decimalAlignPercent}
        />
      </div>

      <div>
        {/* Cell options window */}
        {showCellOptions && (
          <AsupInternalWindow
            key='Cell'
            Title={'Cell options'}
            Visible={showCellOptions}
            onClose={() => {
              setShowCellOptions(false);
            }}
          >
            <div className='aiw-body-row'>
              <AioComment
                label={'Notes'}
                value={comments}
                setValue={isNotRepeat ? (ret) => returnData({ comments: ret }) : undefined}
                commentStyles={tableSettings.commentStyles}
              />
            </div>
            <div className='aiw-body-row'>
              <div className={'aio-label'}>Cell location: </div>
              <div className={'aio-value'}>
                <AioExpander inputObject={location} />
              </div>
            </div>
            <div className='aiw-body-row'>
              <div className={'aio-label'}>Unprocessed text: </div>
              <AsupInternalEditor
                value={text}
                setValue={isNotRepeat ? (ret) => returnData({ text: ret }) : undefined}
                style={
                  isNotRepeat
                    ? {
                        border: '1px solid black',
                        backgroundColor: 'white',
                        borderRadius: '2px',
                        marginRight: '0.5rem',
                        paddingBottom: '4px',
                      }
                    : { border: 0 }
                }
                showStyleButtons={tableSettings.cellStyles !== undefined}
                styleMap={tableSettings.cellStyles}
                textAlignment={justifyText}
                decimalAlignPercent={tableSettings.decimalAlignPercent}
              />
            </div>
            <div className='aiw-body-row'>
              <AioSelect
                label='Justify text'
                value={
                  justifyText === undefined
                    ? 'Default'
                    : justifyText.charAt(0).toUpperCase() + justifyText.substring(1)
                }
                availableValues={['Default', 'Left', 'Center', 'Right', 'Decimal']}
                setValue={
                  isNotRepeat
                    ? (ret) => {
                        let newJ:
                          | DraftComponent.Base.DraftTextAlignment
                          | 'decimal'
                          | null
                          | undefined = undefined;
                        switch (ret) {
                          case 'Left':
                            newJ = 'left';
                            break;
                          case 'Right':
                            newJ = 'right';
                            break;
                          case 'Center':
                            newJ = 'center';
                            break;
                          case 'Decimal':
                            newJ = 'decimal';
                            break;
                          case 'Default':
                            newJ = null;
                            break;
                          default:
                            break;
                        }
                        returnData({ justifyText: newJ });
                      }
                    : undefined
                }
              />
            </div>
            {cellType === AitCellType.header ? (
              <>
                <div className='aiw-body-row'>
                  <div className={'aio-label'}>Row span: </div>
                  <div className={'aio-ro-value'}>{repeatRowSpan ?? rowSpan ?? 1}</div>
                  <div
                    className={'aiox-button-holder'}
                    style={{ padding: '2px' }}
                  >
                    {repeatRowSpan === undefined &&
                    isNotRepeat &&
                    typeof addRowSpan === 'function' &&
                    colSpan === 1 ? (
                      <div
                        className='aiox-button aiox-plus'
                        onClick={() => addRowSpan(location)}
                      />
                    ) : (
                      <div className='aiox-button' />
                    )}
                    {repeatRowSpan === undefined &&
                      isNotRepeat &&
                      typeof removeRowSpan === 'function' && (
                        <div
                          className='aiox-button aiox-minus'
                          onClick={() => removeRowSpan(location)}
                        />
                      )}
                  </div>
                </div>
                <div className='aiw-body-row'>
                  <div className={'aio-label'}>Column span: </div>
                  <div className={'aio-ro-value'}>{repeatColSpan ?? colSpan ?? 1}</div>
                  <div
                    className={'aiox-button-holder'}
                    style={{ padding: '2px' }}
                  >
                    {repeatColSpan === undefined &&
                    isNotRepeat &&
                    typeof addColSpan === 'function' &&
                    rowSpan === 1 ? (
                      <div
                        className='aiox-button aiox-plus'
                        onClick={() => addColSpan(location)}
                      />
                    ) : (
                      <div className='aiox-button' />
                    )}
                    {repeatColSpan === undefined &&
                      isNotRepeat &&
                      typeof removeColSpan === 'function' && (
                        <div
                          className='aiox-button aiox-minus'
                          onClick={() => removeColSpan(location)}
                        />
                      )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            <div className='aiw-body-row'>
              <AioNumber
                label='Width (mm)'
                value={displayColWidth ?? tableSettings.defaultCellWidth}
                setValue={setColWidth !== undefined ? (ret) => setColWidth(ret) : undefined}
              />
            </div>
            {cellType === AitCellType.rowHeader ? (
              <>
                <div className='aiw-body-row'>
                  <div className={'aio-label'}>Text indents: </div>
                  <div className={'aio-ro-value'}>{textIndents ?? 0}</div>
                  <div
                    className={'aiox-button-holder'}
                    style={{ padding: '2px' }}
                  >
                    <div
                      className='aiox-button aiox-plus'
                      onClick={() => returnData({ textIndents: (textIndents ?? 0) + 1 })}
                    />
                    {(textIndents ?? 0) > 0 && (
                      <div
                        className='aiox-button aiox-minus'
                        onClick={() => returnData({ textIndents: (textIndents ?? 0) - 1 })}
                      />
                    )}
                  </div>
                </div>
                <div className='aiw-body-row'>
                  <div className={'aio-label'}>Row span: </div>
                  <div className={'aio-ro-value'}>{rowSpan ?? 1}</div>
                  <div
                    className={'aiox-button-holder'}
                    style={{ padding: '2px' }}
                  >
                    {isNotRepeat && typeof addRowSpan === 'function' && colSpan === 1 ? (
                      <div
                        className='aiox-button aiox-plus'
                        onClick={() => addRowSpan(location)}
                      />
                    ) : (
                      <div className='aiox-button' />
                    )}
                    {isNotRepeat && typeof removeRowSpan === 'function' && (
                      <div
                        className='aiox-button aiox-minus'
                        onClick={() => removeRowSpan(location)}
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </AsupInternalWindow>
        )}
      </div>
    </td>
  );
};
