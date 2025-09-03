        const { useState, useEffect, useMemo, useRef, useCallback } = React;

        // 토스트 알림 컴포넌트
        const Toast = ({ message, type, show, onClose }) => {
            useEffect(() => {
                if (show) {
                    const timer = setTimeout(() => {
                        onClose();
                    }, 3000);
                    return () => clearTimeout(timer);
                }
            }, [show, onClose]);

            return (
                <div className={`toast ${type} ${show ? 'show' : ''}`}>
                    <div className="flex items-center gap-2">
                        <i className={`fas ${type === 'success' ? 'fa-check-circle text-green-600' : 'fa-exclamation-triangle text-red-600'}`}></i>
                        <span>{message}</span>
                    </div>
                </div>
            );
        };

        // 로딩 컴포넌트
        const LoadingSpinner = ({ message = "분석 중..." }) => (
            <div className="loading">
                <div className="flex items-center gap-4">
                    <div className="spinner"></div>
                    <span className="text-gray-500">{message}</span>
                </div>
            </div>
        );

        // 파라미터 조정 컴포넌트
        const ParameterControl = ({ label, value, min, max, step, onChange, description, suffix = "" }) => (
            <div className="parameter-item">
                <div className="parameter-label">
                    <span>{label}</span>
                    <span className="parameter-value">{value}{suffix}</span>
                </div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="slider"
                />
                {description && (
                    <div className="parameter-description">
                        {description}
                    </div>
                )}
            </div>
        );

        // 차트 컴포넌트
        const SalesChart = ({ data, predictions, showConfidenceInterval = true, isLoading = false }) => {
            const chartRef = useRef(null);
            const chartInstanceRef = useRef(null);

            useEffect(() => {
                if (!chartRef.current || isLoading) return;

                const ctx = chartRef.current.getContext('2d');
                
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                const allDates = Array.from(new Set([
                    ...data.map(d => d.date),
                    ...predictions.map(d => d.date)
                ])).sort();
                const actualData = allDates.map(date => {
                    const found = data.find(d => d.date === date);
                    return found ? found.sales : null;
                });
                const predictedData = allDates.map(date => {
                    const found = predictions.find(d => d.date === date);
                    return found ? found.sales : null;
                });

                const datasets = [
                    {
                        label: '실제 매출',
                        data: actualData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        borderWidth: 2
                    },
                    {
                        label: '예측 매출',
                        data: predictedData,
                        borderColor: '#a855f7',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        borderDash: [10, 5],
                        borderWidth: 2
                    }
                ];

                if (showConfidenceInterval && predictions.length > 0) {
                    const upperBoundData = allDates.map(date => {
                        const pred = predictions.find(d => d.date === date);
                        return pred ? pred.sales * 1.15 : null;
                    });
                    const lowerBoundData = allDates.map(date => {
                        const pred = predictions.find(d => d.date === date);
                        return pred ? pred.sales * 0.85 : null;
                    });

                    datasets.push(
                        {
                            label: '95% 신뢰구간 상한',
                            data: upperBoundData,
                            borderColor: 'rgba(168, 85, 247, 0.3)',
                            backgroundColor: 'rgba(168, 85, 247, 0.1)',
                            fill: '+1',
                            tension: 0.4,
                            pointRadius: 0,
                            borderDash: [5, 5],
                            borderWidth: 1
                        },
                        {
                            label: '95% 신뢰구간 하한',
                            data: lowerBoundData,
                            borderColor: 'rgba(168, 85, 247, 0.3)',
                            backgroundColor: 'rgba(168, 85, 247, 0.1)',
                            fill: false,
                            tension: 0.4,
                            pointRadius: 0,
                            borderDash: [5, 5],
                            borderWidth: 1
                        }
                    );
                }

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: allDates,
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: '매출 추이 및 예측 분석',
                                font: {
                                    size: 16,
                                    weight: 'bold'
                                },
                                padding: 20,
                                color: '#ffffff'
                            },
                            legend: {
                                display: true,
                                position: 'bottom',
                                labels: {
                                    padding: 20,
                                    usePointStyle: true,
                                    color: '#cbd5e1'
                                }
                            }
                        },
                        scales: {
                            x: {
                                display: true,
                                title: {
                                    display: true,
                                    text: '날짜',
                                    font: {
                                        weight: 'bold'
                                    },
                                    color: '#cbd5e1'
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: '#94a3b8'
                                }
                            },
                            y: {
                                display: true,
                                title: {
                                    display: true,
                                    text: '매출 (Test)',
                                    font: {
                                        weight: 'bold'
                                    },
                                    color: '#cbd5e1'
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: '#94a3b8'
                                },
                                beginAtZero: false
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        }
                    }
                });

                return () => {
                    if (chartInstanceRef.current) {
                        chartInstanceRef.current.destroy();
                    }
                };
            }, [data, predictions, showConfidenceInterval, isLoading]);

            if (isLoading) {
                return <LoadingSpinner message="차트 생성 중..." />;
            }

            return <canvas ref={chartRef} />;
        };

        // 메인 앱 컴포넌트
        const DarkSalesForecastingApp = () => {
            // 상태 관리
            const [historicalData, setHistoricalData] = useState([]);
            const [selectedAlgorithm, setSelectedAlgorithm] = useState('advanced_ensemble');
            const [selectedCountry, setSelectedCountry] = useState('전체');
            const [selectedProduct, setSelectedProduct] = useState('전체');
            const [isLoading, setIsLoading] = useState(false);
            const [showConfidenceInterval, setShowConfidenceInterval] = useState(true);
            const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
            const [forecastPeriod, setForecastPeriod] = useState(12);
            const [forecastStartMonth, setForecastStartMonth] = useState('');
            const [predictions, setPredictions] = useState([]);

            // 파라미터 상태 관리
            const [algorithmParameters, setAlgorithmParameters] = useState({
                advanced_ensemble: {
                    trend_weight: 1,
                    seasonal_weight: 1,
                    ma_weight: 0.1,
                    exp_weight: 0.2,
                    forecast_length: 12
                },
                gru_network: {
                    hidden_size: 50,
                    sequence_length: 12,
                    learning_rate: 0.01,
                    dropout_rate: 0.2,
                    forecast_length: 12
                },
                wavelet_arima: {
                    decomposition_level: 1,
                    arima_p: 5,
                    arima_d: 1,
                    arima_q: 3,
                    forecast_length: 12
                    
                }
            });

            // 기본값 설정
            const defaultParameters = {
                advanced_ensemble: {
                    trend_weight: 1,
                    seasonal_weight: 1,
                    ma_weight: 0.1,
                    exp_weight: 0.7,
                    forecast_length: 12
                },
                gru_network: {
                    hidden_size: 50,
                    sequence_length: 12,
                    learning_rate: 0.01,
                    dropout_rate: 0.2,
                    forecast_length: 12
                },
                wavelet_arima: {
                    decomposition_level: 2,
                    arima_p: 1,
                    arima_d: 1,
                    arima_q: 1,
                    forecast_length: 12
                }
            };

            // 예측 기간 변경 시 각 알고리즘의 forecast_length 동기화
            useEffect(() => {
                setAlgorithmParameters(prev => ({
                    ...prev,
                    [selectedAlgorithm]: {
                        ...prev[selectedAlgorithm],
                        forecast_length: forecastPeriod
                    }
                }));
            }, [selectedAlgorithm, forecastPeriod]);

            // 샘플 데이터 생성
            const generateSampleData = useCallback(() => {
                const data = [];
                const countries = ['한국', '미국', '일본', '중국', '독일'];
                const products = ['제품A', '제품B', '제품C', '제품D'];
                
                for (let year = 2019; year <= 2024; year++) {
                    for (let month = 1; month <= 12; month++) {
                        countries.forEach(country => {
                            products.forEach(product => {
                                const baseSales = {
                                    '한국': {'제품A': 120, '제품B': 95, '제품C': 75, '제품D': 60},
                                    '미국': {'제품A': 200, '제품B': 170, '제품C': 140, '제품D': 110},
                                    '일본': {'제품A': 100, '제품B': 85, '제품C': 65, '제품D': 50},
                                    '중국': {'제품A': 180, '제품B': 150, '제품C': 120, '제품D': 90},
                                    '독일': {'제품A': 90, '제품B': 75, '제품C': 60, '제품D': 45}
                                }[country][product];
                                
                                const yearGrowth = (year - 2019) * 0.08;
                                const seasonalFactor = 1 + 0.15 * Math.sin((month - 1) / 12 * 2 * Math.PI + Math.PI/6);
                                const randomFactor = 0.85 + Math.random() * 0.3;
                                
                                const sales = Math.round(baseSales * (1 + yearGrowth) * seasonalFactor * randomFactor);
                                
                                data.push({
                                    year,
                                    month,
                                    country,
                                    product,
                                    sales,
                                    date: `${year}-${month.toString().padStart(2, '0')}`
                                });
                            });
                        });
                    }
                }
                return data;
            }, []);

            // 초기 데이터 설정
            useEffect(() => {
                setHistoricalData(generateSampleData());
                showToast('샘플 데이터가 로드되었습니다!', 'success');
            }, [generateSampleData]);

            // 토스트 알림 표시
            const showToast = useCallback((message, type = 'success') => {
                setToast({ show: true, message, type });
            }, []);

            const hideToast = useCallback(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, []);

            // 파라미터 업데이트
            const updateParameter = useCallback((algorithm, param, value) => {
                setAlgorithmParameters(prev => ({
                    ...prev,
                    [algorithm]: {
                        ...prev[algorithm],
                        [param]: value
                    }
                }));
            }, []);

            // 파라미터 리셋
            const resetParameters = useCallback(() => {
                setAlgorithmParameters(prev => ({
                    ...prev,
                    [selectedAlgorithm]: { ...defaultParameters[selectedAlgorithm] }
                }));
                showToast('파라미터가 기본값으로 초기화되었습니다!', 'success');
            }, [selectedAlgorithm]);

            // 고급 알고리즘들
            const algorithms = {
                advanced_ensemble: (data, params, startDate) => {
                    if (data.length < 6) return [];
                    const { trend_weight, seasonal_weight, ma_weight, exp_weight, forecast_length } = params;
                    const [startYear, startMonth] = startDate.split('-').map(Number);
                    const lastValue = data[data.length - 1].sales;
                    const movingAverage = data.slice(-6).reduce((sum, d) => sum + d.sales, 0) / 6;
                    const trend = (lastValue - data[Math.max(0, data.length - 7)].sales) / 6;
                    const weightSum = trend_weight + seasonal_weight + ma_weight + exp_weight || 1;
                    const predictions = [];
                    for (let i = 1; i <= forecast_length; i++) {
                        const trendForecast = lastValue + trend * i;
                        const seasonalForecast = movingAverage * (1 + 0.15 * Math.sin((i - 1) / 12 * 2 * Math.PI));
                        const expForecast = 0.7 * lastValue + 0.3 * movingAverage;
                        const weighted = (trendForecast * trend_weight + seasonalForecast * seasonal_weight + movingAverage * ma_weight + expForecast * exp_weight) / weightSum;
                        const idx = startMonth - 1 + (i - 1);
                        const year = startYear + Math.floor(idx / 12);
                        const month = (idx % 12) + 1;
                        predictions.push({
                            year,
                            month,
                            sales: Math.round(Math.max(0, weighted)),
                            date: `${year}-${month.toString().padStart(2, '0')}`,
                            type: 'predicted'
                        });
                    }
                    return predictions;
                },

                gru_network: async (data, params, startDate) => {
                    const { hidden_size, sequence_length, learning_rate, dropout_rate, forecast_length } = params;
                    if (data.length <= sequence_length) return [];
                    const [startYear, startMonth] = startDate.split('-').map(Number);

                    // 판매 데이터 추출 및 정규화
                    const sales = data.map(d => d.sales);
                    const min = Math.min(...sales);
                    const max = Math.max(...sales);
                    const denom = (max - min) || 1;
                    const normalized = sales.map(v => (v - min) / denom);

                    // 학습용 시퀀스 생성
                    const xs = [];
                    const ys = [];
                    for (let i = sequence_length; i < normalized.length; i++) {
                        xs.push(normalized.slice(i - sequence_length, i));
                        ys.push(normalized[i]);
                    }
                    const xsTensor = tf.tensor3d(xs.map(seq => seq.map(v => [v])), [xs.length, sequence_length, 1]);
                    const ysTensor = tf.tensor2d(ys, [ys.length, 1]);

                    // GRU 모델 구성 및 학습
                    const model = tf.sequential();
                    model.add(tf.layers.gru({ units: hidden_size, inputShape: [sequence_length, 1], dropout: dropout_rate }));
                    model.add(tf.layers.dense({ units: 1 }));
                    model.compile({ optimizer: tf.train.adam(learning_rate), loss: 'meanSquaredError' });
                    await model.fit(xsTensor, ysTensor, { epochs: 50 });

                    xsTensor.dispose();
                    ysTensor.dispose();

                    // 미래 값 예측
                    const predictions = [];
                    let input = normalized.slice(-sequence_length);
                    for (let i = 0; i < forecast_length; i++) {
                        const predTensor = model.predict(tf.tensor3d([input.map(v => [v])], [1, sequence_length, 1]));
                        const pred = (await predTensor.array())[0][0];
                        predTensor.dispose();

                        const denorm = pred * denom + min;
                        const idx = startMonth - 1 + i;
                        const year = startYear + Math.floor(idx / 12);
                        const month = (idx % 12) + 1;
                        predictions.push({
                            year,
                            month,
                            sales: Math.round(Math.max(0, denorm)),
                            date: `${year}-${month.toString().padStart(2, '0')}`,
                            type: 'predicted'
                        });

                        input = [...input.slice(1), pred];
                    }

                    model.dispose();
                    return predictions;
                },

                wavelet_arima: (data, params, startDate) => {
                    if (data.length === 0) return [];
                    const { decomposition_level, arima_p, arima_d, arima_q, forecast_length } = params;
                    const [startYear, startMonth] = startDate.split('-').map(Number);
                    const window = Math.max(2, decomposition_level * 2);
                    const smoothed = data.map((d, idx) => {
                        const start = Math.max(0, idx - window + 1);
                        const slice = data.slice(start, idx + 1);
                        return slice.reduce((s, x) => s + x.sales, 0) / slice.length;
                    });

                    const diffLevels = [smoothed];
                    for (let d = 0; d < arima_d; d++) {
                        const prev = diffLevels[d];
                        const diff = prev.slice(1).map((v, i) => v - prev[i]);
                        diffLevels.push(diff);
                    }

                    let errors = Array(arima_q).fill(0);

                    const predictions = [];

                    for (let i = 1; i <= forecast_length; i++) {
                        const baseDiff = diffLevels[arima_d];
                        const arTerms = baseDiff.slice(-arima_p);
                        const ar = arima_p && arTerms.length
                            ? arTerms.reduce((sum, v, idx) => sum + v * (arTerms.length - idx) / arTerms.length, 0) / arTerms.length
                            : 0;
                        const ma = arima_q
                            ? errors.reduce((sum, v, idx) => sum + v * (errors.length - idx) / errors.length, 0) / errors.length
                            : 0;
                        const nextDiff = ar + ma;

                        if (arima_q) {
                            errors = [nextDiff, ...errors.slice(0, arima_q - 1)];
                        }
                        baseDiff.push(nextDiff);

                        for (let level = arima_d - 1; level >= 0; level--) {
                            const prev = diffLevels[level];
                            const lastVal = prev[prev.length - 1];
                            const increment = diffLevels[level + 1][diffLevels[level + 1].length - 1];
                            prev.push(lastVal + increment);
                        }

                        const next = diffLevels[0][diffLevels[0].length - 1];
                        const idx = startMonth - 1 + (i - 1);
                        const year = startYear + Math.floor(idx / 12);
                        const month = (idx % 12) + 1;
                        predictions.push({
                            year,
                            month,
                            sales: Math.round(Math.max(0, next)),
                            date: `${year}-${month.toString().padStart(2, '0')}`,
                            type: 'predicted'
                        });
                    }

                    return predictions;
                }
            };

            // 필터링된 데이터
            const filteredData = useMemo(() => {
                return historicalData.filter(d => {
                    return (selectedCountry === '전체' || d.country === selectedCountry) &&
                           (selectedProduct === '전체' || d.product === selectedProduct);
                });
            }, [historicalData, selectedCountry, selectedProduct]);

            // 집계된 데이터
            const aggregatedData = useMemo(() => {
                const grouped = {};
                filteredData.forEach(d => {
                    const key = `${d.year}-${d.month.toString().padStart(2, '0')}`;
                    if (!grouped[key]) {
                        grouped[key] = { year: d.year, month: d.month, date: key, sales: 0 };
                    }
                    grouped[key].sales += d.sales;
                });
                return Object.values(grouped).sort((a, b) => a.year - b.year || a.month - b.month);
            }, [filteredData]);

            const trainingData = useMemo(() => {
                if (!forecastStartMonth) return aggregatedData;
                return aggregatedData.filter(d => d.date < forecastStartMonth);
            }, [aggregatedData, forecastStartMonth]);

            useEffect(() => {
                if (aggregatedData.length > 0 && forecastStartMonth === '') {
                    const last = aggregatedData[aggregatedData.length - 1];
                    let year = last.year;
                    let month = last.month + 1;
                    if (month > 12) { year += 1; month = 1; }
                    setForecastStartMonth(`${year}-${month.toString().padStart(2, '0')}`);
                    //const defaultStart = `${year}-${month.toString().padStart(2, '0')}`;
                    //const userInput = window.prompt('예측 시작월을 입력하세요 (YYYY-MM)', defaultStart);
                    //setForecastStartMonth(userInput || defaultStart);
                }
            }, [aggregatedData, forecastStartMonth]);

            // 국가 및 제품 목록
            const countries = useMemo(() => {
                const countrySet = new Set(historicalData.map(d => d.country));
                return ['전체', ...Array.from(countrySet).sort()];
            }, [historicalData]);

            const products = useMemo(() => {
                const productSet = new Set(historicalData.map(d => d.product));
                return ['전체', ...Array.from(productSet).sort()];
            }, [historicalData]);

            // 예측 결과
            useEffect(() => {
                let cancelled = false;
                const runForecast = async () => {
                    if (trainingData.length === 0 || !forecastStartMonth) {
                        setPredictions([]);
                        return;
                    }
                    setIsLoading(true);
                    try {
                        const params = { ...algorithmParameters[selectedAlgorithm], forecast_length: forecastPeriod };
                        const result = await algorithms[selectedAlgorithm](trainingData, params, forecastStartMonth);
                        if (!cancelled) setPredictions(result);
                    } catch (error) {
                        console.error('예측 오류:', error);
                        showToast('예측 중 오류가 발생했습니다.', 'error');
                        if (!cancelled) setPredictions([]);
                    } finally {
                        if (!cancelled) setIsLoading(false);
                    }
                };
                runForecast();
                return () => { cancelled = true; };
            }, [trainingData, selectedAlgorithm, algorithmParameters, forecastPeriod, forecastStartMonth]);

            // 통계 계산
            const stats = useMemo(() => {
                const totalPredicted = predictions.reduce((sum, p) => sum + p.sales, 0);
                const predicted2025 = predictions.filter(p => p.year === 2025).reduce((sum, p) => sum + p.sales, 0);
                const total2024 = aggregatedData.filter(d => d.year === 2024).reduce((sum, d) => sum + d.sales, 0);
                const growthRate = total2024 > 0 ? ((predicted2025 - total2024) / total2024 * 100) : 0;
                const avgMonthly2025 = predicted2025 / Math.min(12, predictions.filter(p => p.year === 2025).length);

                return {
                    total2024,
                    totalPredicted,
                    predicted2025,
                    growthRate,
                    avgMonthly2025
                };
            }, [predictions, aggregatedData]);

            const predictionYearText = useMemo(() => {
                if (!forecastStartMonth) return forecastPeriod > 12 ? '2025-2026년' : '2025년';
                const [startYear, startMonth] = forecastStartMonth.split('-').map(Number);
                const totalMonths = startMonth + forecastPeriod - 1;
                const endYear = startYear + Math.floor((totalMonths - 1) / 12);
                return startYear === endYear ? `${startYear}년` : `${startYear}-${endYear}년`;
            }, [forecastStartMonth, forecastPeriod]);

            // CSV 업로드 처리
            const handleFileUpload = async (event) => {
                const file = event.target.files[0];
                if (!file || file.type !== 'text/csv') {
                    showToast('CSV 파일만 업로드 가능합니다.', 'error');
                    return;
                }

                setIsLoading(true);
                try {
                    const text = await file.text();
                    const lines = text.split('\n');
                    const headers = lines[0].split(',').map(h => h.trim());
                    
                    const parsedData = [];
                    for (let i = 1; i < lines.length; i++) {
                        if (lines[i].trim()) {
                            const values = lines[i].split(',');
                            const row = {};
                            headers.forEach((header, index) => {
                                row[header] = values[index]?.trim();
                            });
                            
                            if (row.year && row.month && row.sales) {
                                parsedData.push({
                                    year: parseInt(row.year),
                                    month: parseInt(row.month),
                                    country: row.country || '기타',
                                    product: row.product || '기타',
                                    sales: parseFloat(row.sales),
                                    date: `${row.year}-${row.month.toString().padStart(2, '0')}`
                                });
                            }
                        }
                    }
                    
                    if (parsedData.length > 0) {
                        setHistoricalData(parsedData);
                        showToast(`${parsedData.length}개의 데이터가 성공적으로 업로드되었습니다!`, 'success');
                    } else {
                        showToast('올바른 형식의 CSV 파일을 업로드해주세요.', 'error');
                    }
                } catch (error) {
                    showToast('파일을 읽는 중 오류가 발생했습니다.', 'error');
                    console.error('File parsing error:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            // CSV 내보내기
            const exportResults = () => {
                const exportData = [
                    ['날짜', '예측 매출 (Test)', '국가', '제품', '알고리즘', '파라미터'],
                    ...predictions.map(pred => [
                        pred.date,
                        pred.sales,
                        selectedCountry,
                        selectedProduct,
                        selectedAlgorithm,
                        JSON.stringify(algorithmParameters[selectedAlgorithm])
                    ])
                ];

                const csvContent = exportData.map(row => row.join(',')).join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `매출예측결과_${selectedAlgorithm}_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
                
                showToast('예측 결과가 CSV 파일로 저장되었습니다!', 'success');
            };

            // 알고리즘 설명 및 파라미터 정보
            const algorithmInfo = {
                advanced_ensemble: {
                    name: "고급 앙상블",
                    description: "여러 간단한 예측 방법을 섞어 평균을 내는 방식으로, 한 가지 방법보다 결과가 덜 흔들립니다.",
                    parameters: {
                        trend_weight: {
                            min: 0,
                            max: 1,
                            step: 0.1,
                            suffix: "",
                            description: "최근 매출의 상승·하락 흐름을 얼마나 반영할지"
                        },
                        seasonal_weight: {
                            min: 0,
                            max: 1,
                            step: 0.1,
                            suffix: "",
                            description: "월별·분기별 반복되는 패턴을 얼마나 반영할지"
                        },
                        ma_weight: {
                            min: 0,
                            max: 1,
                            step: 0.1,
                            suffix: "",
                            description: "지난 몇 달 평균값을 얼마나 참고할지"
                        },
                        exp_weight: {
                            min: 0,
                            max: 1,
                            step: 0.1,
                            suffix: "",
                            description: "가장 최근 매출에 더 큰 비중을 둘지"
                        }
                    }
                },
                gru_network: {
                    name: "GRU 신경망",
                    description: "과거 매출을 차례대로 기억하면서 다음 달 값을 예측하는 인공지능 모델입니다.",
                    parameters: {
                        hidden_size: {
                            min: 16,
                            max: 128,
                            step: 8,
                            suffix: "",
                            description: "모델이 정보를 저장하는 칸의 수"
                        },
                        sequence_length: {
                            min: 6,
                            max: 24,
                            step: 2,
                            suffix: "개월",
                            description: "한 번에 살펴보는 지난 개월 수"
                        },
                        learning_rate: {
                            min: 0.001,
                            max: 0.1,
                            step: 0.001,
                            suffix: "",
                            description: "모델이 얼마나 빠르게 배움을 반영할지"
                        },
                        dropout_rate: {
                            min: 0.1,
                            max: 0.5,
                            step: 0.1,
                            suffix: "",
                            description: "과적합을 막기 위해 임의로 무시하는 정보의 비율"
                        }
                    }
                },
                wavelet_arima: {
                    name: "웨이블릿+ARIMA",
                    description: "데이터를 부드럽게 정리한 뒤 과거 추세와 패턴을 이용해 미래를 예측하는 통계 모델입니다.",
                    parameters: {
                        decomposition_level: {
                            min: 1,
                            max: 5,
                            step: 1,
                            suffix: "",
                            description: "데이터를 얼마나 세세하게 나눠 잡음을 제거할지"
                        },
                        arima_p: {
                            min: 0,
                            max: 5,
                            step: 1,
                            suffix: "",
                            description: "몇 달 전 값까지 참고할지"
                        },
                        arima_d: {
                            min: 0,
                            max: 2,
                            step: 1,
                            suffix: "",
                            description: "추세를 없애기 위해 몇 번 차분할지"
                        },
                        arima_q: {
                            min: 0,
                            max: 5,
                            step: 1,
                            suffix: "",
                            description: "과거 예측 오차를 얼마나 참고할지"
                        }
                    }
                }
            };

            // 파라미터 렌더링 함수
            const renderParameters = () => {
                const info = algorithmInfo[selectedAlgorithm];
                if (!info) return null;

                return (
                    <div className="parameter-section">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold" style={{color: '#cbd5e1'}}>파라미터 조정</h4>
                            <button
                                onClick={resetParameters}
                                className="btn-reset"
                                disabled={isLoading}
                            >
                                <i className="fas fa-undo"></i>
                                기본값으로 리셋
                            </button>
                        </div>
                        
                        <div className="parameter-grid">
                            {Object.entries(info.parameters).map(([key, config]) => (
                                <ParameterControl
                                    key={key}
                                    label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    value={algorithmParameters[selectedAlgorithm][key]}
                                    min={config.min}
                                    max={config.max}
                                    step={config.step}
                                    suffix={config.suffix}
                                    description={config.description}
                                    onChange={(value) => updateParameter(selectedAlgorithm, key, value)}
                                />
                            ))}
                        </div>
                    </div>
                );
            };

            return (
                <div className="app-container">
                    <Toast 
                        message={toast.message} 
                        type={toast.type} 
                        show={toast.show} 
                        onClose={hideToast} 
                    />

                    <div className="header">
                        <h1><i className="fas fa-rocket"></i> Seegene 매출 예측 시뮬레이터</h1>
                        <p>최신 AI 기술을 활용한 차세대 매출 예측 솔루션</p>
                    </div>

                    <div className="container">
                        {/* 통계 요약 */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-value text-blue-600">
                                    {stats.total2024.toLocaleString()}(Test)
                                </div>
                                <div className="stat-label">2024년 실제 매출</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value text-purple-600">
                                    {stats.predicted2025.toLocaleString()}(Test)
                                </div>
                                <div className="stat-label">2025년 예상 매출</div>
                            </div>
                            <div className="stat-card">
                                <div className={`stat-value ${stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stats.growthRate.toFixed(1)}%
                                </div>
                                <div className="stat-label">성장률</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value text-indigo-600">
                                    {stats.avgMonthly2025.toLocaleString()}(Test)
                                </div>
                                <div className="stat-label">월 평균 매출</div>
                            </div>
                        </div>

                        <div className="grid">
                            {/* 컨트롤 패널 */}
                            <div className="space-y-4">
                                {/* 데이터 업로드 */}
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-upload text-blue-600"></i>
                                        <h2 className="card-title">데이터 업로드</h2>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">CSV 파일 업로드</label>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileUpload}
                                            className="form-input"
                                            disabled={isLoading}
                                        />
                                        <div className="text-xs mt-2" style={{color: '#94a3b8'}}>
                                            <strong>필수:</strong> year, month, sales<br/>
                                            <strong>선택:</strong> country, product
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            setHistoricalData(generateSampleData());
                                            showToast('샘플 데이터가 다시 로드되었습니다!', 'success');
                                        }}
                                        className="btn btn-secondary mt-2 w-full"
                                        disabled={isLoading}
                                    >
                                        <i className="fas fa-refresh"></i>
                                        샘플 데이터 재로드
                                    </button>
                                </div>

                                {/* 필터 설정 */}
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-filter text-green-600"></i>
                                        <h2 className="card-title">필터 설정</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="fas fa-globe"></i> 국가
                                            </label>
                                            <select 
                                                value={selectedCountry}
                                                onChange={(e) => setSelectedCountry(e.target.value)}
                                                className="form-select"
                                                disabled={isLoading}
                                            >
                                                {countries.map(country => (
                                                    <option key={country} value={country}>{country}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                <i className="fas fa-box"></i> 제품
                                            </label>
                                            <select 
                                                value={selectedProduct}
                                                onChange={(e) => setSelectedProduct(e.target.value)}
                                                className="form-select"
                                                disabled={isLoading}
                                            >
                                                {products.map(product => (
                                                    <option key={product} value={product}>{product}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* AI 알고리즘 선택 */}
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-brain text-purple-600"></i>
                                        <h2 className="card-title">AI 알고리즘 & 파라미터</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="form-group">
                                            <label className="form-label">예측 모델 선택</label>
                                            <select
                                                value={selectedAlgorithm}
                                                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                                                className="form-select"
                                                disabled={isLoading}
                                            >
                                                <option value="advanced_ensemble">고급 앙상블</option>
                                                <option value="wavelet_arima">웨이블릿+ARIMA</option>
                                                <option value="gru_network">AI 모델 -GRU 신경망</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">예측 기간</label>
                                            <select
                                                value={forecastPeriod}
                                                onChange={(e) => setForecastPeriod(parseInt(e.target.value))}
                                                className="form-select"
                                                disabled={isLoading}
                                            >
                                                <option value={12}>12개월</option>
                                                <option value={24}>24개월</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">예측 시작월</label>
                                            <input
                                                type="month"
                                                value={forecastStartMonth}
                                                onChange={(e) => setForecastStartMonth(e.target.value)}
                                                className="form-input"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        {/* 알고리즘 설명 */}
                                        {algorithmInfo[selectedAlgorithm] && (
                                            <div className="algorithm-description">
                                                <div className="algorithm-badge badge-ai">
                                                    <i className="fas fa-robot"></i>
                                                    {algorithmInfo[selectedAlgorithm].name}
                                                </div>
                                                <p className="text-sm mt-2" style={{color: '#cbd5e1'}}>
                                                    {algorithmInfo[selectedAlgorithm].description}
                                                </p>
                                            </div>
                                        )}

                                        {/* 파라미터 조정 */}
                                        {renderParameters()}

                                        <div className="form-group">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={showConfidenceInterval}
                                                    onChange={(e) => setShowConfidenceInterval(e.target.checked)}
                                                    className="mr-2"
                                                    disabled={isLoading}
                                                />
                                                <span className="text-sm">95% 신뢰구간 표시</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* 결과 내보내기 */}
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-download text-green-600"></i>
                                        <h2 className="card-title">결과 내보내기</h2>
                                    </div>
                                    <button 
                                        onClick={exportResults}
                                        className="btn btn-success w-full"
                                        disabled={isLoading || predictions.length === 0}
                                    >
                                        <i className="fas fa-file-csv"></i>
                                        CSV 파일로 저장
                                    </button>
                                </div>
                            </div>

                            {/* 차트 및 결과 */}
                            <div className="space-y-4">
                                {/* 차트 */}
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-chart-line text-blue-600"></i>
                                        <h2 className="card-title">매출 추이 및 AI 예측</h2>
                                        <span className="algorithm-badge badge-ai">
                                            {algorithmInfo[selectedAlgorithm]?.name}
                                        </span>
                                    </div>
                                    <div className="chart-container">
                                        <SalesChart 
                                            data={aggregatedData} 
                                            predictions={predictions} 
                                            showConfidenceInterval={showConfidenceInterval}
                                            isLoading={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* 예측 테이블 */}
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-table text-purple-600"></i>
                                        <h2 className="card-title">{predictionYearText} 월별 예측</h2>
                                    </div>
                                    
                                    {isLoading ? (
                                        <LoadingSpinner message="AI 모델 계산 중..." />
                                    ) : (
                                        <div className="table-container">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>날짜</th>
                                                        <th className="text-right">예측 매출 (Test)</th>
                                                        <th className="text-right">신뢰구간</th>
                                                        <th>모델</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {predictions.map((pred, index) => (
                                                        <tr key={index}>
                                                            <td className="font-medium">{pred.date}</td>
                                                            <td className="text-right font-bold text-purple-600">
                                                                {pred.sales.toLocaleString()}
                                                            </td>
                                                            <td className="text-right text-xs" style={{color: '#94a3b8'}}>
                                                                {showConfidenceInterval ? 
                                                                    `±${(pred.sales * 0.15).toFixed(0)}` : 
                                                                    'N/A'}
                                                            </td>
                                                             <td>
                                                                    <span className="algorithm-badge badge-ai">
                                                                        {algorithmInfo[selectedAlgorithm]?.name}
                                                                    </span>
                                                                </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                  

 {/* 파라메터 현황 및 튜닝 가이드 */}
                                <div className="card" style={{background: 'linear-gradient(135deg, rgba(40,40,60,0.9) 0%, rgba(20,20,40,0.9) 100%)'}}>
                                    <div className="card-header">
                                        <i className="fas fa-cogs text-blue-600"></i>
                                        <h2 className="card-title">🎛️ 파라메터 튜닝 가이드</h2>
                                    </div>
                                    
                                    <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
                                        <div>
                                            <h4 className="font-bold text-blue-700 mb-2">🎯 현재 설정</h4>
                                            <div className="bg-white p-3 rounded-lg text-xs">
                                                <strong>모델:</strong> {algorithmInfo[selectedAlgorithm]?.name}<br/>
                                                <strong>파라메터:</strong><br/>
                                                {Object.entries(algorithmParameters[selectedAlgorithm]).map(([key, value]) => (
                                                    <div key={key} className="ml-2">
                                                        • {key}: <span className="text-blue-600 font-mono">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-bold text-purple-700 mb-2">💡 튜닝 팁</h4>
                                            <ul className="text-sm text-purple-600 space-y-1">
                                                <li>• 과적합 발생시 → 복잡도 관련 파라메터 감소</li>
                                                <li>• 과소적합 발생시 → 모델 용량 관련 파라메터 증가</li>
                                                <li>• 불안정한 예측시 → 학습률/가중치 조정</li>
                                                <li>• 계절성 미반영시 → 계절성 관련 파라메터 증가</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-4 bg-white rounded-lg border-l-4 border-green-500">
                                        <h4 className="font-bold text-gray-800 mb-2">📋 CSV 파일 형식 예시</h4>
                                        <div className="bg-gray-100 rounded p-3 text-xs font-mono">
                                            year,month,country,product,sales<br/>
                                            2019,1,한국,제품A,150<br/>
                                            2019,1,한국,제품B,120<br/>
                                            2019,1,미국,제품A,280<br/>
                                            2020,1,한국,제품A,165<br/>
                                            ...
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">
                                            <strong>필수 컬럼:</strong> year(연도), month(월), sales(매출)<br/>
                                            <strong>선택 컬럼:</strong> country(국가), product(제품)
                                        </p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        // 앱 렌더링
        ReactDOM.render(<DarkSalesForecastingApp />, document.getElementById('root'));
