// =====================================
// components/calendar/MonthlyPieChart.js
// =====================================
import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { getMonthlyPieData } from '../../utils/savingsUtils';
import { styles } from '../../styles/calendar';

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 60;
const CENTER_X = CHART_SIZE / 2;
const CENTER_Y = CHART_SIZE / 2;
const RADIUS = (CHART_SIZE / 2) - 60;
const INNER_RADIUS = RADIUS * 0.6;

const MonthlyPieChart = ({ dailySavings, month, year }) => {
    const [selectedSlice, setSelectedSlice] = useState(null);

    const pieData = getMonthlyPieData(dailySavings, month, year);
    const totalSavings = pieData.reduce((sum, item) => sum + item.amount, 0);

    const displayData = pieData.length === 1
        ? [{ ...pieData[0], forceFullCircle: true }]
        : pieData;

    const createPieSlices = () => {
        if (totalSavings === 0) return [];

        let currentAngle = -90;

        return displayData.map((item, index) => {
            const percentage = item.forceFullCircle ? 1 : item.amount / totalSavings;
            const angle = item.forceFullCircle ? 359.9 : percentage * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const isSelected = selectedSlice && selectedSlice.name === item.name;
            const scale = isSelected ? 1.03 : 1;

            const midAngle = (startAngle + endAngle) / 2;
            const midAngleRad = (midAngle * Math.PI) / 180;
            const offsetX = isSelected ? 6 * Math.cos(midAngleRad) : 0;
            const offsetY = isSelected ? 6 * Math.sin(midAngleRad) : 0;

            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;

            const scaledRadius = RADIUS * scale;
            const scaledInnerRadius = INNER_RADIUS * scale;

            const x1 = CENTER_X + offsetX + scaledRadius * Math.cos(startAngleRad);
            const y1 = CENTER_Y + offsetY + scaledRadius * Math.sin(startAngleRad);
            const x2 = CENTER_X + offsetX + scaledRadius * Math.cos(endAngleRad);
            const y2 = CENTER_Y + offsetY + scaledRadius * Math.sin(endAngleRad);

            const x3 = CENTER_X + offsetX + scaledInnerRadius * Math.cos(startAngleRad);
            const y3 = CENTER_Y + offsetY + scaledInnerRadius * Math.sin(startAngleRad);
            const x4 = CENTER_X + offsetX + scaledInnerRadius * Math.cos(endAngleRad);
            const y4 = CENTER_Y + offsetY + scaledInnerRadius * Math.sin(endAngleRad);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
                `M ${x3} ${y3}`,
                `L ${x1} ${y1}`,
                `A ${scaledRadius} ${scaledRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `L ${x4} ${y4}`,
                `A ${scaledInnerRadius} ${scaledInnerRadius} 0 ${largeArcFlag} 0 ${x3} ${y3}`,
                'Z'
            ].join(' ');

            return {
                pathData,
                color: item.color,
                item,
                index,
                isSelected
            };
        });
    };

    const slices = createPieSlices();

    const handleSlicePress = (item) => {
        if (selectedSlice && selectedSlice.name === item.name) {
            setSelectedSlice(null);
        } else {
            setSelectedSlice(item);
        }
    };

    if (totalSavings === 0) {
        return (
            <View style={[styles.weeklyChartContainer, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.emptyChartText}>Bu ay henüz tasarruf yok</Text>
            </View>
        );
    }

    return (
        <View style={styles.weeklyChartContainer}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Svg width={CHART_SIZE} height={CHART_SIZE}>
                    <G>
                        {slices.map((slice, index) => (
                            <Path
                                key={index}
                                d={slice.pathData}
                                fill={slice.color}
                                stroke="white"
                                strokeWidth="2"
                                onPress={() => handleSlicePress(slice.item)}
                            />
                        ))}
                    </G>
                </Svg>

                {/* Center Text */}
                <View style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: INNER_RADIUS * 2,
                    height: INNER_RADIUS * 2,
                    borderRadius: INNER_RADIUS,
                }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                        {selectedSlice ? selectedSlice.name : 'Toplam'}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>
                        {selectedSlice
                            ? `${selectedSlice.amount.toFixed(2)} ₺`
                            : `${totalSavings.toFixed(2)} ₺`}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default MonthlyPieChart;
