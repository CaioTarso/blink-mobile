import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getServices } from '@/services/services'; 
import { getProfessionals } from '@/services/users'; // Alterado para a função que filtra a equipe
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configuração PT-BR
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
};
LocaleConfig.defaultLocale = 'pt-br';

const MOCK_PETS = [
  { id: '1', name: 'Rex', breed: 'Golden Retriever', weight: '10 kg', image: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg' },
  { id: '2', name: 'Mimi', breed: 'Siamês', weight: '5 kg', image: 'https://placekitten.com/200/200' },
  { id: '3', name: 'Lyon', breed: 'Pit bull', weight: '25 kg', image: 'https://images.dog.ceo/breeds/pitbull/n02108089_1150.jpg' },
  { id: '4', name: 'Banguela', breed: 'Bombay', weight: '4 kg', image: 'https://placekitten.com/201/201' },
];

export default function BookingScreen() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  
  const initialState = {
    pet: null,
    service: null,
    professional: null,
    date: '', 
    time: null
  };

  const [appointment, setAppointment] = useState(initialState);

  useEffect(() => {
    getServices().then(setServices);
    // Usando getProfessionals para garantir que só venha Admin/Staff ativo
    getProfessionals().then(setProfessionals).catch(() => console.log("Erro ao carregar profissionais"));
  }, []);

  const handleCancel = () => {
    setAppointment(initialState);
    setStep(1);
  };

  const renderStepper = () => (
    step < 6 && (
      <View style={styles.stepperContainer}>
        {[1, 2, 3, 4, 5].map((item, index) => (
          <React.Fragment key={item}>
            <View style={[styles.stepCircle, step === item ? styles.activeCircle : styles.inactiveCircle]}>
              <Text style={styles.stepNumberText}>{item}</Text>
            </View>
            {index < 4 && <View style={styles.stepLine} />}
          </React.Fragment>
        ))}
      </View>
    )
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          {step < 6 && (
            <TouchableOpacity onPress={() => step > 1 && setStep(step - 1)}>
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>
          )}
          <View style={styles.titleWrapper}>
            <Text style={styles.mainTitle}>
              {step === 6 ? "Tudo pronto!" : "Agendar Serviço"}
            </Text>
            {step < 6 && (
              <Text style={styles.subtitle}>
                {step === 1 && "Selecione o seu pet"}
                {step === 2 && "Escolha o serviço"}
                {step === 3 && "Escolha o profissional"}
                {step === 4 && "Escolha data e hora"}
                {step === 5 && "Revise e confirme o agendamento"}
              </Text>
            )}
          </View>
        </View>
        {renderStepper()}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* PASSO 1: PETS */}
        {step === 1 && MOCK_PETS.map(pet => (
          <TouchableOpacity key={pet.id} style={styles.card} onPress={() => { setAppointment({...appointment, pet}); setStep(2); }}>
            <Image source={{ uri: pet.image }} style={styles.petImage} />
            <View>
              <Text style={styles.cardTitle}>{pet.name}</Text>
              <Text style={styles.cardSub}>{pet.breed} - {pet.weight}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* PASSO 2: SERVIÇOS */}
        {step === 2 && services.map((item) => (
          <TouchableOpacity key={item.id} style={styles.serviceCard} onPress={() => { setAppointment({ ...appointment, service: item }); setStep(3); }}>
            <Image source={{ uri: item.image }} style={styles.serviceImage} />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceDescription} numberOfLines={2}>{item.description}</Text>
              <Text style={styles.servicePrice}>R$ {item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* PASSO 3: PROFISSIONAL (COM CARGO) */}
        {step === 3 && professionals.map(pro => (
          <TouchableOpacity key={pro.id} style={styles.serviceCard} onPress={() => { setAppointment({...appointment, professional: pro}); setStep(4); }}>
            <View style={styles.proImageContainer}>
              {pro.image ? (
                 <Image source={{ uri: pro.image }} style={styles.fullImg} />
              ) : (
                 <Ionicons name="person" size={40} color="#FFF" />
              )}
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{pro.name}</Text>
              <Text style={styles.roleText}>{pro.specialty || pro.role}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* PASSO 4: CALENDÁRIO */}
        {step === 4 && (
          <View>
            <Calendar
              minDate={new Date().toISOString().split('T')[0]}
              disabledDaysIndexes={[0]} 
              onDayPress={day => setAppointment({ ...appointment, date: day.dateString })}
              markedDates={{ [appointment.date]: { selected: true, selectedColor: '#1E9400' } }}
              theme={{ todayTextColor: '#1E9400', arrowColor: '#1E9400', textMonthFontWeight: 'bold' }}
            />
            <Text style={styles.sectionTitle}>Selecione o horário</Text>
            <View style={styles.timeGrid}>
              {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(t => (
                <TouchableOpacity key={t} style={[styles.timeBtn, appointment.time === t && styles.timeBtnActive]} onPress={() => setAppointment({...appointment, time: t})}>
                  <Text style={[styles.timeText, appointment.time === t && styles.timeTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={[styles.confirmBtn, (!appointment.time || !appointment.date) && { backgroundColor: '#CCC' }]} 
              onPress={() => appointment.time && setStep(5)}
              disabled={!appointment.time || !appointment.date}
            >
              <Text style={styles.confirmBtnText}>Revisar agendamento</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PASSO 5: RESUMO */}
        {/* PASSO 5: RESUMO */}
{step === 5 && (
  <View>
    <View style={styles.summaryBox}>
      <Text style={styles.sumLabel}>Pet</Text>
      <Text style={styles.sumValue}>{appointment.pet?.name}</Text>
    </View>
    
    <View style={styles.summaryBox}>
      <Text style={styles.sumLabel}>Serviço</Text>
      <Text style={styles.sumValue}>{appointment.service?.name}</Text>
    </View>
    
    <View style={styles.summaryBox}>
      <Text style={styles.sumLabel}>Profissional</Text>
      <Text style={styles.sumValue}>
        {appointment.professional?.name} ({appointment.professional?.specialty || appointment.professional?.role})
      </Text>
    </View>
    
    <View style={styles.summaryBox}>
      <Text style={styles.sumLabel}>Data e Horário</Text>
      <Text style={styles.sumValue}>{appointment.date} às {appointment.time}</Text>
    </View>

    {/* NOVO: VALOR TOTAL NO RESUMO */}
    <View style={[styles.summaryBox, styles.totalBox]}>
      <Text style={styles.totalLabel}>Valor Total</Text>
      <Text style={styles.totalValue}>
        R$ {appointment.service?.price ? appointment.service.price.toFixed(2) : '0.00'}
      </Text>
    </View>
    
    <View style={styles.footerBtns}>
      <TouchableOpacity style={styles.cancelAction} onPress={handleCancel}>
        <Text style={styles.confirmBtnText}>Cancelar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.confirmAction} onPress={() => setStep(6)}>
        <Text style={styles.confirmBtnText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

        {/* PASSO 6: SUCESSO */}
        {step === 6 && (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={100} color="#1E9400" />
            <Text style={styles.successTitle}>Serviço agendado com sucesso!</Text>
            <Text style={styles.successSub}>Você pode acompanhar seus agendamentos na tela inicial.</Text>
            <TouchableOpacity style={styles.backHomeBtn} onPress={handleCancel}>
              <Text style={styles.confirmBtnText}>Voltar para o Início</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingHorizontal: 20, paddingTop: 50, backgroundColor: '#FFF' },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  titleWrapper: { marginLeft: 10 },
  mainTitle: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  stepCircle: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  activeCircle: { backgroundColor: '#F9A825' },
  inactiveCircle: { backgroundColor: '#B2D8D3' },
  stepNumberText: { color: '#FFF', fontWeight: 'bold' },
  stepLine: { width: 20, height: 1, backgroundColor: '#CCC', marginHorizontal: 8 },
  content: { padding: 20 },
  card: { padding: 15, backgroundColor: '#F5F5F5', borderRadius: 12, marginBottom: 15, flexDirection: 'row', alignItems: 'center' },
  petImage: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSub: { fontSize: 14, color: '#666' },
  serviceCard: { flexDirection: 'row', padding: 15, backgroundColor: '#F5F5F5', borderRadius: 12, marginBottom: 15 },
  serviceImage: { width: 90, height: 90, borderRadius: 10, marginRight: 15 },
  proImageContainer: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#54A779', marginRight: 15, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  fullImg: { width: '100%', height: '100%' },
  serviceInfo: { flex: 1, justifyContent: 'center' },
  serviceName: { fontSize: 18, fontWeight: 'bold' },
  roleText: { fontSize: 14, color: '#1E9400', fontWeight: '600', marginTop: 2 },
  serviceDescription: { fontSize: 12, color: '#444' },
  servicePrice: { fontSize: 16, fontWeight: 'bold', marginTop: 5, color: '#1E9400' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 15 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  timeBtn: { width: '31%', padding: 10, borderWidth: 1, borderColor: '#1E9400', borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  timeBtnActive: { backgroundColor: '#1E9400' },
  timeText: { color: '#1E9400', fontWeight: 'bold' },
  timeTextActive: { color: '#FFF' },
  confirmBtn: { backgroundColor: '#1E9400', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  confirmBtnText: { color: '#FFF', fontWeight: 'bold' },
  summaryBox: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, marginBottom: 10 },
  sumLabel: { fontSize: 12, color: '#666' },
  sumValue: { fontSize: 16, fontWeight: 'bold' },
  footerBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelAction: { backgroundColor: '#FF5252', flex: 0.48, padding: 15, borderRadius: 10, alignItems: 'center' },
  confirmAction: { backgroundColor: '#1E9400', flex: 0.48, padding: 15, borderRadius: 10, alignItems: 'center' },
  successContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  successTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  successSub: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 10, paddingHorizontal: 20 },
  backHomeBtn: { backgroundColor: '#F9A825', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 40, width: '100%' },
  totalBox: {
    backgroundColor: '#E8F5E9', // 
    borderWidth: 1,
    borderColor: '#1E9400',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E9400',
  },

  
});