// Side-by-side bars per period (e.g. income / spending / savings per week).
// Tapping a period selects it; the parent shows its exact values.
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { KINDS } from '../../domain/constants';
import { formatCompact, formatNumber } from '../../lib/money';
import { colors } from '../../theme';

const AXIS_WIDTH = 38;
const LABEL_HEIGHT = 22;
const TOP_PADDING = 8;
// SVG text falls back to a serif font in browsers.
const FONT_FAMILY = Platform.select({ web: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', default: undefined });

// Rounds the axis maximum up to 1, 2, 2.5 or 5 × 10^n.
const niceMax = (value) => {
  if (!(value > 0)) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (step * magnitude >= value) return step * magnitude;
  }
  return 10 * magnitude;
};

// Axis labels: small non-integer steps (e.g. 2,5) keep one decimal.
const axisLabel = (value) => (value < 10 && !Number.isInteger(value) ? formatNumber(value, { decimals: 1 }) : formatCompact(value));

export default function GroupedBarChart({ data, kinds, selectedIndex, onSelect, height = 170 }) {
  const [width, setWidth] = useState(0);
  const chartHeight = height - LABEL_HEIGHT - TOP_PADDING;
  const highest = Math.max(0, ...data.flatMap((bucket) => kinds.map((kind) => bucket[kind])));
  const max = niceMax(highest);
  const plotWidth = Math.max(0, width - AXIS_WIDTH);
  const groupWidth = data.length ? plotWidth / data.length : 0;
  const barWidth = Math.max(3, Math.min(14, (groupWidth * 0.72) / Math.max(1, kinds.length)));
  const groupInner = barWidth * kinds.length + (kinds.length - 1) * 2;

  const y = (value) => TOP_PADDING + chartHeight - (value / max) * chartHeight;

  return (
    <View style={{ height }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <>
          <Svg width={width} height={height}>
            {[0, 0.5, 1].map((fraction) => {
              const lineY = y(max * fraction);
              return (
                <React.Fragment key={fraction}>
                  <Line x1={AXIS_WIDTH} x2={width} y1={lineY} y2={lineY} stroke={colors.border} strokeWidth={1} strokeDasharray={fraction === 0 ? undefined : '3,4'} />
                  {highest > 0 || fraction === 0 ? (
                    <SvgText x={AXIS_WIDTH - 6} y={lineY + 4} fontSize={10} fontFamily={FONT_FAMILY} fill={colors.textFaint} textAnchor="end">
                      {axisLabel(max * fraction)}
                    </SvgText>
                  ) : null}
                </React.Fragment>
              );
            })}

            {data.map((bucket, i) => {
              const groupX = AXIS_WIDTH + i * groupWidth;
              const selected = i === selectedIndex;
              const startX = groupX + (groupWidth - groupInner) / 2;
              return (
                <React.Fragment key={bucket.from}>
                  {selected ? (
                    <Rect x={groupX + 2} y={TOP_PADDING - 4} width={groupWidth - 4} height={chartHeight + 4} rx={8} fill={colors.divider} />
                  ) : null}
                  {kinds.map((kind, k) => {
                    const value = bucket[kind];
                    const barHeight = value > 0 ? Math.max(2, (value / max) * chartHeight) : 0;
                    return (
                      <Rect
                        key={kind}
                        x={startX + k * (barWidth + 2)}
                        y={TOP_PADDING + chartHeight - barHeight}
                        width={barWidth}
                        height={barHeight}
                        rx={Math.min(3, barWidth / 2)}
                        fill={KINDS[kind].color}
                        opacity={selectedIndex == null || selected ? 1 : 0.45}
                      />
                    );
                  })}
                  <SvgText
                    x={groupX + groupWidth / 2}
                    y={height - 6}
                    fontSize={11}
                    fontFamily={FONT_FAMILY}
                    fontWeight={selected ? '700' : '400'}
                    fill={selected ? colors.text : colors.textMuted}
                    textAnchor="middle"
                  >
                    {bucket.label}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
          {highest === 0 ? (
            <View style={[StyleSheet.absoluteFill, styles.empty]}>
              <Text style={styles.emptyText}>Bu dönemde kayıt yok</Text>
            </View>
          ) : null}
          {/* Touch targets on top of the drawing work the same on every platform. */}
          <View style={[StyleSheet.absoluteFill, styles.touchRow, { left: AXIS_WIDTH }]}>
            {data.map((bucket, i) => (
              <Pressable
                key={bucket.from}
                style={styles.touch}
                onPress={() => onSelect?.(i)}
                accessibilityRole="button"
                accessibilityLabel={bucket.label}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  touchRow: { flexDirection: 'row' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingBottom: LABEL_HEIGHT, pointerEvents: 'none' },
  emptyText: { fontSize: 13, color: colors.textFaint },
  touch: { flex: 1 },
});
