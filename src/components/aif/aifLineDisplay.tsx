import React, { useCallback, useEffect, useState } from 'react';
import { AieStyleMap, AsupInternalEditor } from '../aie';
import { AioExternalSingle, AioIconButton, AioSelect } from '../aio';
import { AsupInternalWindow } from '../aiw';
import './aif.css';
import { AifBlockLine } from './aifInterface';
import { OriginalText } from './OriginalText';
import { replaceBlockText } from './replaceBlockText';

interface AifLineDisplayProps {
  aifid?: string;
  left?: string | null;
  center?: string | null;
  right?: string | null;
  externalSingles?: AioExternalSingle[];
  addBelow?: boolean;
  canEdit?: boolean;
  canRemove?: boolean;
  canMove?: boolean;
  setLine?: (ret: AifBlockLine) => void;
  addLine?: () => void;
  removeLine?: () => void;
  style?: React.CSSProperties;
  styleMap?: AieStyleMap;
}

export const AifLineDisplay = ({
  aifid,
  left,
  center,
  right,
  externalSingles,
  addBelow,
  canEdit,
  canRemove,
  canMove,
  setLine,
  addLine,
  removeLine,
  style,
  styleMap,
}: AifLineDisplayProps): JSX.Element => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const returnData = useCallback(
    (lineUpdate: { left?: string | null; center?: string | null; right?: string | null }) => {
      if (typeof setLine !== 'function') return;
      const newLine = {
        aifid: aifid,
        left: lineUpdate.left ?? left,
        center: lineUpdate.center ?? center,
        right: lineUpdate.right ?? right,
        addBelow: addBelow,
        canEdit: canEdit,
        canRemove: canRemove,
        canMove: canMove,
      };
      setLine(newLine);
    },
    [addBelow, aifid, canEdit, canMove, canRemove, center, left, right, setLine],
  );

  // Set up post replacement view
  const [displayLeft, setDisplayLeft] = useState<string | null | undefined>(left);
  const [displayCenter, setDisplayCenter] = useState<string | null | undefined>(center);
  const [displayRight, setDisplayRight] = useState<string | null | undefined>(right);

  // Update for replacements
  const processReplacement = useCallback(
    (text: string | null | undefined): string | null => {
      if (typeof text !== 'string') return null;
      // Process external replacements
      if (externalSingles !== undefined && externalSingles.length > 0) {
        externalSingles.forEach((repl) => {
          if (repl.oldText !== undefined && repl.oldText !== '' && repl.newText !== undefined) {
            const { newText, updated } = replaceBlockText(text, repl);
            if (updated) text = newText;
          }
        });
      }
      return text;
    },
    [externalSingles],
  );

  useEffect(() => setDisplayLeft(processReplacement(left)), [left, processReplacement]);
  useEffect(() => setDisplayCenter(processReplacement(center)), [center, processReplacement]);
  useEffect(() => setDisplayRight(processReplacement(right)), [right, processReplacement]);

  return (
    <div
      className={`aif-line ${
        canEdit === false || typeof setLine !== 'function' ? 'aif-readonly' : ''
      }`}
    >
      {showOptions && (
        <AsupInternalWindow
          Title='Line options'
          Visible={showOptions}
          onClose={() => setShowOptions(false)}
        >
          <div className='aiw-body-row'>
            <AioSelect
              label='Line type'
              availableValues={[
                'Left only',
                'Center only',
                'Left, Center and Right',
                'Left and Right',
              ]}
              value={
                typeof left === 'string' && typeof center === 'string' && typeof right === 'string'
                  ? 'Left, Center and Right'
                  : typeof left === 'string' && typeof right === 'string'
                  ? 'Left and Right'
                  : typeof left === 'string'
                  ? 'Left only'
                  : 'Center only'
              }
              setValue={
                typeof setLine === 'function'
                  ? (ret) => {
                      switch (ret) {
                        case 'Left only':
                          left = left || '';
                          center = null;
                          right = null;
                          break;
                        case 'Center only':
                          left = null;
                          center = center || '';
                          right = null;
                          break;
                        case 'Left and Right':
                          left = left || '';
                          center = null;
                          right = right || '';
                          break;
                        case 'Left, Center and Right':
                        default:
                          left = left || '';
                          center = center || '';
                          right = right || '';
                          break;
                      }
                      returnData({ left, center, right });
                    }
                  : undefined
              }
            />
          </div>
          <OriginalText
            label='Left text'
            text={left}
            setText={(ret) => returnData({ left: ret })}
            styleMap={styleMap}
          />
          <OriginalText
            label='Center text'
            text={center}
            setText={(ret) => returnData({ center: ret })}
          />
          <OriginalText
            label='Right text'
            text={right}
            setText={(ret) => returnData({ right: ret })}
          />
        </AsupInternalWindow>
      )}

      <div className='aif-line-buttons' />
      <div
        className='aif-line-item-holder'
        style={{ ...style }}
      >
        {typeof displayLeft === 'string' && (
          <div
            className={`aif-line-item ${displayLeft !== left ? 'aif-readonly' : ''}`}
            style={{
              width:
                typeof center !== 'string' && typeof right !== 'string'
                  ? '100%'
                  : typeof center !== 'string'
                  ? '50%'
                  : '33%',
            }}
          >
            <AsupInternalEditor
              value={displayLeft}
              setValue={
                typeof setLine === 'function' && displayLeft === left
                  ? (ret) => returnData({ left: ret })
                  : undefined
              }
              showStyleButtons={true}
              styleMap={styleMap}
            />
          </div>
        )}
        {typeof displayCenter === 'string' && (
          <div
            className={`aif-line-item ${displayCenter !== center ? 'aif-readonly' : ''}`}
            style={{ flexGrow: 1 }}
          >
            <AsupInternalEditor
              value={displayCenter}
              setValue={
                typeof setLine === 'function' && displayCenter === center
                  ? (ret) => returnData({ center: ret })
                  : undefined
              }
              textAlignment={'center'}
              showStyleButtons={true}
              styleMap={styleMap}
            />
          </div>
        )}
        {typeof displayRight === 'string' && (
          <div
            className={`aif-line-item ${displayRight !== right ? 'aif-readonly' : ''}`}
            style={{
              width:
                typeof center !== 'string' && typeof left !== 'string'
                  ? '100%'
                  : typeof center !== 'string'
                  ? '50%'
                  : '33%',
            }}
          >
            <AsupInternalEditor
              value={displayRight}
              setValue={
                typeof setLine === 'function' && displayRight === right
                  ? (ret) => returnData({ right: ret })
                  : undefined
              }
              textAlignment={'right'}
              showStyleButtons={styleMap !== undefined}
              styleMap={styleMap}
            />
          </div>
        )}
      </div>

      <div className='aif-line-buttons'>
        <AioIconButton
          onClick={() => setShowOptions(!showOptions)}
          iconName={'aio-button-row-options'}
          tipText='Options'
        />
        {typeof addLine === 'function' ? (
          <AioIconButton
            onClick={addLine}
            iconName={'aiox-plus'}
            tipText='Add line'
          />
        ) : (
          <div style={{ width: '18px' }} />
        )}
        {typeof removeLine === 'function' && (
          <AioIconButton
            onClick={removeLine}
            iconName={'aiox-minus'}
            tipText='Remove line'
          />
        )}
      </div>
    </div>
  );
};
