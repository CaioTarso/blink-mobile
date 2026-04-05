import { Input } from "@/components/Input";
import { AdminMenu } from "@/components/admin/navigation/AdminMenu";
import { getServices, Service } from "@/services/services";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Modal as RNModal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [modalMode, setModalMode] = useState<"new" | "edit" | null>(null); 
    const [image, setImage] = useState<string | null>(null);

    // Função para buscar imagem na galeria do celular
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            alert("Precisamos de permissão para acessar suas fotos!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Função para fechar o modal e LIMPAR os dados 
    const handleCloseModal = () => {
        setModalMode(null);
        setImage(null);
    };

    useEffect(() => {
        getServices().then(setServices);
    }, []);

    const renderItem = ({ item }: { item: Service }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.cardPrice}>R$ {item.price.toFixed(2)}</Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={[styles.btnSmall, { backgroundColor: "#FFA500" }]}
                        onPress={() => setModalMode("edit")}
                    >
                        <Text style={styles.btnSmallText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnSmall, { backgroundColor: "#FF4B4B" }]}>
                        <Text style={styles.btnSmallText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Ionicons name="chevron-back" size={24} color="black" />
                <Text style={styles.headerTitle}>Serviços</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.searchRow}>
                <View style={{ flex: 1 }}>
                    <Input placeholder="Buscar" />
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalMode("new")}
                >
                    <Ionicons name="add" size={25} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />

            {/* MODAL (NOVO OU EDITAR SERVIÇO) */}
            <RNModal visible={modalMode !== null} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Ionicons name="chevron-back" size={24} color="black" onPress={handleCloseModal} />
                            <Text style={styles.modalTitle}>
                                {modalMode === "new" ? "Novo serviço" : "Editar serviço"}
                            </Text>
                            <Ionicons name="close" size={28} color="black" onPress={handleCloseModal} />
                        </View>

                        <Text style={styles.label}>Nome</Text>
                        <Input placeholder="" />

                        <Text style={styles.label}>Descrição</Text>
                        <Input placeholder="" multiline />

                        <Text style={styles.label}>Preço</Text>
                        <Input placeholder="" keyboardType="numeric" />

                        <Text style={styles.label}>URL da imagem</Text>
                        <Input placeholder="" />

                        <Text style={styles.sectionTitle}>Arquivo</Text>
                        <TouchableOpacity style={styles.dashedBox} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={{ width: "100%", height: 100, borderRadius: 10 }} />
                            ) : (
                                <>
                                    <Text style={styles.orangeLink}>Fazer o upload ou copiar link</Text>
                                    <Ionicons name="document-text" size={24} color="#FFD700" style={{ marginTop: 5 }} />
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity 
                                style={[styles.btnLarge, { backgroundColor: "#62A97C" }]}
                                onPress={handleCloseModal} // Simulando salvar e fechar/limpar
                            >
                                <Text style={styles.btnLargeText}>
                                    {modalMode === "new" ? "Salvar" : "Atualizar"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnLarge, { backgroundColor: "#FF4B4B" }]}
                                onPress={handleCloseModal}
                            >
                                <Text style={styles.btnLargeText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </RNModal>

            <View style={styles.menuWrapper}>
                <AdminMenu />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        paddingHorizontal: 20
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 50,
        marginBottom: 20
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold"
    },
    searchRow: {
        flexDirection: "row",
        gap: 5,
        height: 45,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    addButton: {
        backgroundColor: "#4CD964",
        width: 50,
        height: 45,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -15
    },
    listContent: {
        paddingBottom: 120
    },
    card: {
        backgroundColor: "#E0E0E0",
        borderRadius: 15,
        flexDirection: "row",
        padding: 10,
        marginBottom: 15
    },
    cardImage: {
        width: 100,
        height: 100, // Ajustado para ser quadrado e fixo
        borderRadius: 10
    },
    cardInfo: {
        flex: 1,
        marginLeft: 15
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold"
    },
    cardDescription: {
        fontSize: 12,
        color: "#666",
        marginVertical: 4
    },
    cardPrice: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8
    },
    cardActions: {
        flexDirection: "row",
        gap: 8
    },
    btnSmall: {
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 8
    },
    btnSmallText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold"
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "flex-end"
    },
    modalContent: {
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        paddingBottom: 40
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold"
    },
    label: {
        fontSize: 14,
        color: "#333",
        marginTop: 15,
        marginBottom: 5,
        fontWeight: "600"
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 25
    },
    dashedBox: {
        borderWidth: 1,
        borderColor: "#CCC",
        borderStyle: "dashed",
        borderRadius: 15,
        padding: 20,
        alignItems: "center",
        marginTop: 10,
        minHeight: 100,
        justifyContent: "center"
    },
    orangeLink: {
        color: "#FFA500",
        fontWeight: "bold",
        fontSize: 14
    },
    modalFooter: {
        flexDirection: "row",
        gap: 15,
        marginTop: 30
    },
    btnLarge: {
        flex: 1,
        padding: 16,
        borderRadius: 15,
        alignItems: "center"
    },
    btnLargeText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    },
    menuWrapper: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20
    }
});